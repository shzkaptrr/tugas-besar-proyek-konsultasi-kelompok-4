<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\SubMateri;
use App\Models\Pendaftaran;
use App\Models\Pembayaran;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserMateriController extends Controller
{
    /**
     * Get all materials that user has access to based on their payments
     */
    public function getMyMaterials(Request $request)
    {
        $user = Auth::user();
        
        // Get all sukses payments for this user
        $suksesPayments = Pembayaran::whereHas('pendaftaran', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->where('status_pembayaran', 'sukses')->get();
        
        if ($suksesPayments->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No sukses payments found',
                'data' => []
            ], 200);
        }
        
        // Get product IDs from sukses payments
        $produkIds = $suksesPayments->map(function($payment) {
            return $payment->pendaftaran->produk_id;
        })->unique()->values();
        
        // Get materials for these products
        $materials = [];
        foreach ($produkIds as $produkId) {
            $produk = Produk::find($produkId);
            $materis = Materi::where('produk_id', $produkId)
                           ->orderBy('urutan')
                           ->with(['subMateris' => function($query) {
                               $query->orderBy('urutan');
                           }])
                           ->get();
            
            $materials[] = [
                'produk' => $produk,
                'materis' => $materis
            ];
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'User materials retrieved successfully',
            'data' => $materials
        ], 200);
    }
    
    /**
     * Get materials for specific product that user has access to
     */
    public function getMateriByProduk($produk_id, Request $request)
    {
        $user = Auth::user();
        
        // Check if user has sukses payment for this product
        $hasAccess = Pembayaran::whereHas('pendaftaran', function($query) use ($user, $produk_id) {
            $query->where('user_id', $user->id)
                  ->where('produk_id', $produk_id);
        })->where('status_pembayaran', 'sukses')->exists();
        
        if (!$hasAccess) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have access to this product materials'
            ], 403);
        }
        
        $produk = Produk::find($produk_id);
        if (!$produk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
        
        $materis = Materi::where('produk_id', $produk_id)
                        ->orderBy('urutan')
                        ->with(['subMateris' => function($query) {
                            $query->orderBy('urutan');
                        }])
                        ->get();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product materials retrieved successfully',
            'data' => [
                'produk' => $produk,
                'materis' => $materis
            ]
        ], 200);
    }
    
    /**
     * Get specific sub material content
     */
    public function getSubMateri($sub_materi_id, Request $request)
    {
        $user = Auth::user();
        
        $subMateri = SubMateri::with('materi.produk')->find($sub_materi_id);
        
        if (!$subMateri) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sub material not found'
            ], 404);
        }
        
        // Check if user has access to this sub material's product
        $produk_id = $subMateri->materi->produk_id;
        $hasAccess = Pembayaran::whereHas('pendaftaran', function($query) use ($user, $produk_id) {
            $query->where('user_id', $user->id)
                  ->where('produk_id', $produk_id);
        })->where('status_pembayaran', 'sukses')->exists();
        
        if (!$hasAccess) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have access to this material'
            ], 403);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Sub material retrieved successfully',
            'data' => $subMateri
        ], 200);
    }
}