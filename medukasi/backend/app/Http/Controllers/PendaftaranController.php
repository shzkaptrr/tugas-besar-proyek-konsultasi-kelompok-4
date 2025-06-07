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
    // app/Http/Controllers/PendaftaranController.php

public function getMyPurchasedProducts()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    $loggedInUserId = $user->user_id; // Pastikan ini sudah $user->user_id

    $purchasedProducts = Pendaftaran::where('user_id', $loggedInUserId) // Pastikan ini $user->user_id
                                ->whereHas('pembayaran', function ($query) {
                                    $query->where('status_konfirmasi', 'sukses');
                                })
                                ->with(['produk', 'pembayaran']) // <--- TAMBAHKAN 'pembayaran' DI SINI
                                ->get();

    return response()->json([
        'status' => 'success',
        'message' => 'Purchased products retrieved successfully',
        'data' => $purchasedProducts
    ], 200);
}

}