<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Pendaftaran;
use Illuminate\Support\Facades\Storage;

class PembayaranController extends Controller
{
    // Menampilkan semua pembayaran
    public function index()
    {
        $pembayaran = Pembayaran::with('pendaftaran')->get();
        return response()->json($pembayaran);
    }

    // Menampilkan detail pembayaran berdasarkan ID
    public function show($id)
    {
        try {
            $pembayaran = Pembayaran::with(['pendaftaran.produk'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $pembayaran
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data pembayaran tidak ditemukan'
            ], 404);
        }
    }

    // Membuat pembayaran baru
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pendaftaran_id' => 'required|exists:pendaftaran,pendaftaran_id',
            'metode_pembayaran' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Ambil data pendaftaran untuk mendapatkan jumlah pembayaran
            $pendaftaran = Pendaftaran::with('produk')->findOrFail($request->pendaftaran_id);
            
            $pembayaran = Pembayaran::create([
                'pendaftaran_id' => $request->pendaftaran_id,
                'metode_pembayaran' => $request->metode_pembayaran,
                'jumlah_pembayaran' => $pendaftaran->produk->harga,
                'status_konfirmasi' => 'menunggu',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil dibuat',
                'data' => $pembayaran
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    // Upload bukti pembayaran
    public function uploadBukti(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'bukti_pembayaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $pembayaran = Pembayaran::findOrFail($id);

            // Hapus file lama jika ada
            if ($pembayaran->bukti_pembayaran && Storage::exists('public/' . $pembayaran->bukti_pembayaran)) {
                Storage::delete('public/' . $pembayaran->bukti_pembayaran);
            }

            // Upload file baru
            $file = $request->file('bukti_pembayaran');
            $filename = 'bukti_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('bukti_pembayaran', $filename, 'public');

            // Update data pembayaran
            $pembayaran->update([
                'bukti_pembayaran' => $filePath,
                'tanggal_pembayaran' => now(),
                'status_konfirmasi' => 'menunggu'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti pembayaran berhasil diunggah',
                'data' => $pembayaran
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal upload bukti pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    // Konfirmasi pembayaran (untuk admin)
    public function konfirmasi(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status_konfirmasi' => 'required|in:dikonfirmasi,ditolak',
            'catatan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $pembayaran = Pembayaran::findOrFail($id);
            $pembayaran->update([
                'status_konfirmasi' => $request->status_konfirmasi,
                'tanggal_konfirmasi' => now(),
                'catatan' => $request->catatan
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status pembayaran berhasil diupdate',
                'data' => $pembayaran
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status pembayaran'
            ], 500);
        }
    }
}