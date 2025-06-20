<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use App\Models\Pembayaran;
use App\Models\SubMateri;
use App\Models\SubMateriUserStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MateriAksesController extends Controller
{
    /**
     * Memproses akses materi secara manual berdasarkan pembayaran ID
     */
    public function prosesAkses($pembayaranId)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($pembayaranId);
            
            // Hanya admin atau pemilik pembayaran yang bisa memproses
            $user = Auth::user();
            if ($user->role !== 'admin' && $pembayaran->pendaftaran->user_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk memproses pembayaran ini'
                ], 403);
            }
            
            // Verifikasi status pembayaran
            if ($pembayaran->status_konfirmasi !== 'sukses') {
                return response()->json([
                    'success' => false,
                    'message' => 'Pembayaran belum dikonfirmasi sukses'
                ], 400);
            }
            
            // Ambil pendaftaran
            $pendaftaran = $pembayaran->pendaftaran;
            if (!$pendaftaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pendaftaran tidak ditemukan untuk pembayaran ini'
                ], 404);
            }
            
            $user_id = $pendaftaran->user_id;
            $produk_id = $pendaftaran->produk_id;
            
            // Ambil semua materi dari produk
            $materis = Materi::where('produk_id', $produk_id)->get();
            $totalMateris = $materis->count();
            
            $totalSubMateri = 0;
            $totalCreatedStatus = 0;
            $totalExistingStatus = 0;
            
            // Loop melalui semua materi
            foreach ($materis as $materi) {
                // Ambil semua sub-materi
                $subMateris = SubMateri::where('materi_id', $materi->materi_id)->get();
                $totalSubMateri += $subMateris->count();
                
                // Loop melalui semua sub-materi
                foreach ($subMateris as $subMateri) {
                    // Cek apakah status sudah ada
                    $existingStatus = SubMateriUserStatus::where('user_id', $user_id)
                        ->where('sub_materi_id', $subMateri->sub_materi_id)
                        ->first();
                    
                    if ($existingStatus) {
                        $totalExistingStatus++;
                    } else {
                        // Buat status baru
                        $status = new SubMateriUserStatus();
                        $status->user_id = $user_id;
                        $status->sub_materi_id = $subMateri->sub_materi_id;
                        $status->status = 'buka';
                        $status->save();
                        
                        $totalCreatedStatus++;
                    }
                }
            }
            
            // Log aktivitas
            Log::info('MateriAksesController: Akses materi diproses melalui API', [
                'pembayaran_id' => $pembayaranId,
                'user_id' => $user_id,
                'produk_id' => $produk_id,
                'total_materi' => $totalMateris,
                'total_sub_materi' => $totalSubMateri,
                'created_status' => $totalCreatedStatus,
                'existing_status' => $totalExistingStatus
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Akses materi berhasil diproses',
                'data' => [
                    'pembayaran_id' => $pembayaranId,
                    'user_id' => $user_id,
                    'produk_id' => $produk_id,
                    'total_materi' => $totalMateris,
                    'total_sub_materi' => $totalSubMateri,
                    'created_status' => $totalCreatedStatus,
                    'existing_status' => $totalExistingStatus
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('MateriAksesController: Error saat memproses akses materi', [
                'pembayaran_id' => $pembayaranId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses akses materi: ' . $e->getMessage()
            ], 500);
        }
    }
}