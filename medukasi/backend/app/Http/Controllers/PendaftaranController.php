<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pendaftaran;
use Illuminate\Support\Facades\Auth;
use App\Models\Produk;
use App\Models\User;
use App\Models\Pembayaran;

class PendaftaranController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'asal_sekolah' => 'required|string|max:255',
            'no_telp_ortu' => 'required|string|max:20',
            'sumber_informasi' => 'required|string|max:255',
            'produk_id' => 'required|exists:produks,produk_id',
        ]);

        $pendaftaran = new Pendaftaran();
        $pendaftaran->user_id = Auth::id();
        $pendaftaran->produk_id = $request->produk_id;
        $pendaftaran->tanggal_pendaftaran = now();
        $pendaftaran->sumber_informasi = $request->sumber_informasi;
        $pendaftaran->asal_sekolah = $request->asal_sekolah;
        $pendaftaran->no_telp_ortu = $request->no_telp_ortu;
        $pendaftaran->status = 'menunggu';
        $pendaftaran->save();

        // PERBAIKAN: Return data pendaftaran dengan ID
        return response()->json([
            'message' => 'Pendaftaran berhasil disimpan',
            'data' => $pendaftaran,
            'id' => $pendaftaran->pendaftaran_id  // Tambahkan ID untuk akses mudah
        ], 201);
    }

    public function show($id)
    {
        // Akan mencari berdasarkan 'pendaftaran_id' karena sudah diset di model
        $pendaftaran = Pendaftaran::with('produk')->find($id);

        if (!$pendaftaran) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan'], 404);
        }

        return response()->json($pendaftaran);
    }
    
    // API endpoint untuk mendapatkan semua pendaftaran (untuk admin)
    public function getAllPendaftaran()
    {
        // Log the current user accessing the admin dashboard
        $user = auth()->user();
        \Log::info('Admin dashboard accessed by user:', [
            'user_id' => $user->id,
            'name' => $user->nama_lengkap ?? $user->name ?? 'Unknown',
            'email' => $user->email,
            'role' => $user->role ?? 'Unknown'
        ]);

        $pendaftaran = Pendaftaran::with(['user', 'produk'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $pendaftaran
        ]);
    }

    
// app/Http/Controllers/PendaftaranController.php
public function getMyPurchasedProducts()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    // Add detailed debug logging to check user details
    \Log::info('getMyPurchasedProducts accessed by user:', [
        'user_id_attribute' => $user->id ?? 'not set',
        'user_id_custom' => $user->user_id ?? 'not set',
        'name' => $user->nama_lengkap ?? $user->name ?? 'Unknown',
        'email' => $user->email,
        'role' => $user->role ?? 'Unknown'
    ]);

    // Try using the custom user_id field which is our primary key
    $loggedInUserId = $user->user_id ?? $user->id; 

    // Perbaikan: Gunakan query yang hanya mengambil produk dengan status pembayaran "sukses"
    // tanpa tergantung pada status pembayaran lainnya
    $purchasedProducts = Pendaftaran::where('user_id', $loggedInUserId)
                            ->whereHas('pembayaran', function ($query) {
                                $query->where('status_konfirmasi', 'sukses');
                            })
                            ->with(['produk', 'pembayaran' => function ($query) {
                                // Hanya ambil pembayaran dengan status sukses
                                $query->where('status_konfirmasi', 'sukses');
                            }]) 
                            ->get();
    
    \Log::info('Purchased products result:', [
        'count' => $purchasedProducts->count(),
        'products' => $purchasedProducts->pluck('produk_id')->toArray()
    ]);

    // Debug: Log semua pendaftaran & pembayaran user ini untuk memastikan query benar
    $allPendaftaran = Pendaftaran::where('user_id', $loggedInUserId)->with('pembayaran')->get();
    \Log::info('All pendaftaran for this user:', [
        'count' => $allPendaftaran->count(),
        'pendaftaran' => $allPendaftaran->map(function($p) {
            return [
                'pendaftaran_id' => $p->pendaftaran_id,
                'produk_id' => $p->produk_id,
                'status' => $p->status,
                'pembayaran' => $p->pembayaran ? [
                    'pembayaran_id' => $p->pembayaran->pembayaran_id ?? null,
                    'status_konfirmasi' => $p->pembayaran->status_konfirmasi ?? null
                ] : null
            ];
        })->toArray()
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Purchased products retrieved successfully',
        'data' => $purchasedProducts
    ], 200);
}
}