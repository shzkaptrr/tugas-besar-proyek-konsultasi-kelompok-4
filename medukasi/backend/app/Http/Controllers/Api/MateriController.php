<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Produk;
use App\Models\Pendaftaran; // Pastikan model Pendaftaran sudah ada dan diimport
use App\Models\Pembayaran;  // Pastikan model Pembayaran sudah ada dan diimport
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Untuk mendapatkan user yang sedang login

class MateriController extends Controller
{
    /**
     * Display a listing of the resource.
     * Mengambil semua materi.
     * Untuk role siswa, endpoint ini bisa digunakan untuk menampilkan semua materi yang diizinkan (misalnya, materi free).
     * Jika tujuannya hanya untuk admin/tutor melihat semua materi yang ada, bisa jadi tanpa filter akses.
     * Untuk siswa, jika ingin melihat daftar materi yang dimiliki, lebih disarankan menggunakan
     * endpoint `getByProdukId` yang sudah memiliki filter akses.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Untuk endpoint index ini, kita asumsikan untuk daftar umum atau admin/tutor.
        // Jika Anda ingin ini hanya menampilkan materi yang diakses user,
        // logikanya akan lebih kompleks karena harus mencari semua produk yang dimiliki user
        // dan kemudian mengumpulkan semua materi dari produk-produk tersebut.
        // Untuk saat ini, kita biarkan menampilkan semua materi dengan produknya.

        $materis = Materi::with('produk')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Materis retrieved successfully',
            'data' => $materis
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     * Metode ini biasanya untuk role admin atau pengelola konten.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validasi input data untuk pembuatan materi
        $validator = Validator::make($request->all(), [
            'produk_id' => 'required|exists:produks,produk_id',
            'nama_materi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'urutan' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Buat materi baru di database
        $materi = Materi::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Materi created successfully',
            'data' => $materi
        ], 201);
    }

    /**
     * Display the specified resource.
     * Mengambil detail satu materi berdasarkan ID, dengan validasi akses pengguna.
     * User harus memiliki akses ke produk yang memuat materi ini.
     *
     * @param  int  $id (materi_id)
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = Auth::user(); // Dapatkan user yang sedang login

        // Pastikan user terautentikasi
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        // Mengambil materi beserta produk dan sub-materinya (eager loading)
        $materi = Materi::with(['produk', 'subMateris'])->find($id);

        // Cek apakah materi ditemukan
        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi not found'
            ], 404);
        }
        

        // --- LOGIKA CEK AKSES PRODUK UNTUK MATERI INI ---
        // Periksa apakah user memiliki pendaftaran 'paid' untuk produk yang memiliki materi ini.
        $hasAccess = Pendaftaran::where('user_id', $user->user_id)
                                ->where('produk_id', $materi->produk_id) // Menggunakan produk_id dari materi yang ditemukan
                                ->whereHas('pembayaran', function ($query) {
                                    // Cek apakah ada pembayaran terkait yang sudah 'konfirmasi'
                                    $query->where('status_konfirmasi', 'sukses'); // <--- SESUAIKAN DENGAN NILAI ENUM 'PAID' ANDA
                                })
                                ->exists();

        // Jika user tidak memiliki akses, kembalikan error 403 Forbidden
        if (!$hasAccess) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses ke materi ini karena tidak memiliki akses ke produk terkait atau pembayaran belum dikonfirmasi.'
            ], 403);
        }
        // --- END LOGIKA CEK AKSES ---

        return response()->json([
            'status' => 'success',
            'message' => 'Materi retrieved successfully',
            'data' => $materi
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     * Metode ini biasanya untuk role admin atau pengelola konten.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id (materi_id)
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'produk_id' => 'required|exists:produks,produk_id',
            'nama_materi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'urutan' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $materi->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Materi updated successfully',
            'data' => $materi
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * Metode ini biasanya untuk role admin atau pengelola konten.
     *
     * @param  int  $id (materi_id)
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi not found'
            ], 404);
        }

        $materi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Materi deleted successfully'
        ], 200);
    }

    /**
     * Get materis by produk_id.
     * Digunakan untuk mengambil semua modul (materi) untuk produk tertentu,
     * dengan pengecekan akses produk berdasarkan pendaftaran user melalui tabel pembayaran.
     * Endpoint ini sangat cocok untuk halaman "My Class" atau "Daftar Materi Produk XYZ".
     *
     * @param  int  $produk_id
     * @return \Illuminate\Http\Response
     */
    public function getByProdukId($produk_id)
    {
        $user = Auth::user(); // Dapatkan user yang sedang login

        // Pastikan user terautentikasi
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        // Cek apakah produk_id itu sendiri ada di database
        $produk = Produk::find($produk_id);
        if (!$produk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produk not found'
            ], 404);
        }

        // --- LOGIKA CEK AKSES PRODUK UNTUK USER INI ---
        // Periksa apakah user yang sedang login memiliki pendaftaran untuk produk ini
        // DAN status pembayaran pendaftaran tersebut sudah 'konfirmasi'.
        $hasAccess = Pendaftaran::where('user_id', $user->user_id)
                                ->where('produk_id', $produk_id)
                                ->whereHas('pembayaran', function ($query) {
                                    // Cek apakah ada pembayaran terkait yang sudah 'konfirmasi'
                                    $query->where('status_konfirmasi', 'sukses'); // <--- SESUAIKAN DENGAN NILAI ENUM 'PAID' ANDA
                                })
                                ->exists();

        // Jika user tidak memiliki akses, kembalikan error 403 Forbidden
        if (!$hasAccess) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda belum memiliki akses ke produk ini atau pembayaran belum dikonfirmasi.'
            ], 403);
        }
        // --- END LOGIKA CEK AKSES PRODUK UNTUK USER INI ---

        // Jika user memiliki akses, ambil semua materi (beserta sub-materinya) untuk produk ini
        $materis = Materi::where('produk_id', $produk_id)
                         ->with('subMateris') // Eager load subMateris untuk setiap materi
                         ->orderBy('urutan')
                         ->get();

        // Cek jika tidak ada materi untuk produk ini (meskipun user punya akses ke produknya)
        if ($materis->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Tidak ada materi ditemukan untuk produk ini.',
                'data' => []
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Materis for product retrieved successfully',
            'data' => $materis
        ], 200);
    }
}