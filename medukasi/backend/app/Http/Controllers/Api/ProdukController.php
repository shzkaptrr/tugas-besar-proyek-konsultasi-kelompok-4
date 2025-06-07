<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Produk;
use Illuminate\Http\Response;
use App\Models\Materi;

class ProdukController extends Controller
{
    // GET /api/produk
    public function index()
    {
        $produks = Produk::all();
        return response()->json($produks, Response::HTTP_OK);
    }

    // POST /api/produk
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'deskripsi_produk' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'status' => 'boolean',
        ]);

        $produk = Produk::create($validated);

        return response()->json($produk, Response::HTTP_CREATED);
    }

    // GET /api/produk/{id}
    public function show($id)
    {
        $produk = Produk::find($id);

        if (!$produk) {
            return response()->json(['message' => 'Produk tidak ditemukan'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($produk, Response::HTTP_OK);
    }

    // PUT /api/produk/{id}
    public function update(Request $request, $id)
    {
        $produk = Produk::find($id);

        if (!$produk) {
            return response()->json(['message' => 'Produk tidak ditemukan'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'nama_produk' => 'sometimes|required|string|max:255',
            'deskripsi_produk' => 'sometimes|required|string',
            'harga' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|boolean',
        ]);

        $produk->update($validated);

        return response()->json($produk, Response::HTTP_OK);
    }

    // DELETE /api/produk/{id}
    public function destroy($id)
    {
        $produk = Produk::find($id);

        if (!$produk) {
            return response()->json(['message' => 'Produk tidak ditemukan'], Response::HTTP_NOT_FOUND);
        }

        $produk->delete();

        return response()->json(['message' => 'Produk berhasil dihapus'], Response::HTTP_OK);
    }

    public function getMaterisByProduk($produkId)
{
    $materis = Materi::with(['subMateris.userStatus'])
        ->where('produk_id', $produkId)
        ->orderBy('urutan')
        ->get();

    $materis->each(function ($materi) {
        $materi->sub_materis->each(function ($sub) {
            // Paksa accessor agar default muncul
            $sub->setRelation('user_status', $sub->user_status);
            $sub->unsetRelation('userStatus');
        });
    });

    return response()->json([
        'status' => 'success',
        'message' => 'Materis for product retrieved successfully',
        'data' => $materis
    ]);
}



}
