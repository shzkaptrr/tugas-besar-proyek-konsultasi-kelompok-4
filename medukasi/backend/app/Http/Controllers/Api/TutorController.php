<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\Produk;
use App\Models\User;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TutorController extends Controller
{
    /**
     * Mendapatkan data profil tutor yang sedang login
     */
    public function getMyProfile()
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'tutor') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized or not a tutor'
            ], 403);
        }
        
        $tutor = Tutor::with('user')->where('user_id', $user->user_id)->first();
        
        if (!$tutor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tutor profile not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $tutor
        ]);
    }
    
    /**
     * Mendapatkan produk yang diajar oleh tutor yang sedang login
     */
    public function getMyProducts()
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'tutor') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized or not a tutor'
            ], 403);
        }
        
        $tutor = Tutor::where('user_id', $user->user_id)->first();
        
        if (!$tutor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tutor profile not found'
            ], 404);
        }
        
        $products = $tutor->produks()->with(['materis' => function($query) {
            $query->orderBy('urutan');
        }])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
    
    /**
     * Mendapatkan siswa yang terdaftar pada produk yang diajar oleh tutor
     */
    public function getStudentsByProduct($produkId)
    {
        try {
            // Debugging - log fungsi dipanggil dan parameter produkId
            \Log::info("TutorController getStudentsByProduct dipanggil", [
                'produk_id' => $produkId,
                'user' => auth()->user() ? auth()->user()->nama_lengkap : 'tidak login',
                'ip_address' => request()->ip()
            ]);
            
            $user = Auth::user();
            
            // Debug informasi user
            \Log::info("Informasi user yang login", [
                'user_id' => $user ? $user->user_id : null,
                'role' => $user ? $user->role : null,
                'email' => $user ? $user->email : null
            ]);
            
            // Pastikan user adalah tutor
            if (!$user || $user->role !== 'tutor') {
                \Log::warning("Akses ditolak: Bukan tutor", [
                    'user_id' => $user ? $user->user_id : null,
                    'role' => $user ? $user->role : null
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or not a tutor'
                ], 403);
            }
            
            // Cek apakah produk valid
            $produk = Produk::find($produkId);
            if (!$produk) {
                \Log::warning("Produk tidak ditemukan", ['produk_id' => $produkId]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found'
                ], 404);
            }

            // Log query yang akan dilakukan
            \Log::info("Akan melakukan query pendaftaran untuk produk", [
                'produk_id' => $produkId,
                'query' => "SELECT * FROM pendaftarans WHERE produk_id = {$produkId}"
            ]);
            
            // Pendekatan langsung: Ambil semua pendaftaran untuk produk ini
            // dan ambil data siswa via relasi user dengan eager loading
            $pendaftarans = Pendaftaran::where('produk_id', $produkId)
                ->with('user') // Eager load user untuk mendapatkan data siswa
                ->get();
                
            \Log::info("Jumlah pendaftaran ditemukan", [
                'count' => $pendaftarans->count(),
                'produk_id' => $produkId
            ]);
            
            // Debug pendaftarans yang didapat
            foreach ($pendaftarans as $index => $pendaftaran) {
                \Log::info("Pendaftaran #{$index}", [
                    'pendaftaran_id' => $pendaftaran->pendaftaran_id,
                    'user_id' => $pendaftaran->user_id,
                    'has_user_relation' => $pendaftaran->user ? 'yes' : 'no'
                ]);
            }
            
            // Transformasi data untuk response
            $students = [];
            foreach ($pendaftarans as $pendaftaran) {
                // Skip jika user tidak ada, tapi log untuk debugging
                if (!$pendaftaran->user) {
                    \Log::warning("Pendaftaran tanpa data user", [
                        'pendaftaran_id' => $pendaftaran->pendaftaran_id,
                        'user_id' => $pendaftaran->user_id,
                        'pendaftaran_details' => $pendaftaran->toArray()
                    ]);
                    continue;
                }
                
                \Log::info("Memproses pendaftaran", [
                    'pendaftaran_id' => $pendaftaran->pendaftaran_id,
                    'user_id' => $pendaftaran->user->user_id,
                    'nama' => $pendaftaran->user->nama_lengkap ?? 'Tidak ada nama'
                ]);
                
                // Gunakan null coalescing operator untuk mencegah error jika properti tidak ada
                $students[] = [
                    'pendaftaran_id' => $pendaftaran->pendaftaran_id,
                    'user_id' => $pendaftaran->user->user_id ?? null,
                    'nama' => $pendaftaran->user->nama_lengkap ?? 'Nama tidak tersedia',
                    'email' => $pendaftaran->user->email ?? '',
                    'tanggal_bergabung' => $pendaftaran->tanggal_pendaftaran ?? '',
                    'asal_sekolah' => $pendaftaran->asal_sekolah ?? '-',
                    'status' => $pendaftaran->status ?? 'Unknown'
                ];
            }
            
            \Log::info("Data siswa berhasil diolah", [
                'product_id' => $produkId,
                'student_count' => count($students)
            ]);
            
            return response()->json([
                'status' => 'success',
                'data' => $students
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error in getStudentsByProduct', [
                'product_id' => $produkId,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve students: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Membuat atau mengupdate profil tutor
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'tutor') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized or not a tutor'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'spesialisasi' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'pengalaman' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $tutor = Tutor::updateOrCreate(
            ['user_id' => $user->user_id],
            [
                'spesialisasi' => $request->spesialisasi,
                'bio' => $request->bio,
                'pengalaman' => $request->pengalaman,
            ]
        );
        
        return response()->json([
            'status' => 'success',
            'message' => 'Tutor profile updated',
            'data' => $tutor
        ]);
    }
}