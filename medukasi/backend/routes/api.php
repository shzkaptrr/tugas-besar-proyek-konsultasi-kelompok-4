<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\AuthController; // Ini sudah benar, jika AuthController juga di luar folder Api
use App\Http\Controllers\PendaftaranController; // Ini sudah benar
use App\Http\Controllers\PembayaranController; // Ini sudah benar
use App\Http\Controllers\Api\MateriController;
use App\Http\Controllers\Api\SubMateriController;
use App\Http\Controllers\SubMateriStatusController;

// Route yang sudah ada
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Tambahkan route baru untuk testing koneksi
Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend is connected!',
        'data' => [
            'service' => 'Laravel API',
            'version' => '1.0',
            'time' => now()
        ]
    ]);
});

// Route API Resource untuk Produk
Route::apiResource('produk', ProdukController::class);

// Route untuk autentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout']);

// Endpoint untuk mengecek user yang sedang login
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->post('/pendaftaran', [PendaftaranController::class, 'store']);
Route::middleware('auth:sanctum')->get('/pendaftaran/{id}', [PendaftaranController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // Routes untuk pembayaran
    Route::get('pembayaran', [PembayaranController::class, 'index']);
    Route::post('pembayaran', [PembayaranController::class, 'store']);
    Route::get('pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('pembayaran/{id}/upload-bukti', [PembayaranController::class, 'uploadBukti']);
    Route::put('pembayaran/{id}/konfirmasi', [PembayaranController::class, 'konfirmasi']);

    // --- NEW ROUTES FOR MATERI AND SUBMATERI ---

    // Routes untuk Materi (Modul)
    Route::apiResource('materis', MateriController::class);
    // Custom route untuk mengambil materi berdasarkan produk_id
    Route::get('produk/{produk_id}/materis', [MateriController::class, 'getByProdukId']);

    // Routes untuk SubMateri (Lessons)
    Route::apiResource('sub-materis', SubMateriController::class);
    // Custom route untuk mengambil sub_materi berdasarkan materi_id (modul), opsional bisa filter tipe
    Route::get('materis/{materi_id}/sub-materis', [SubMateriController::class, 'getByMateriId']);

    // --- Rute Baru untuk mengambil produk yang dibeli user ---
    Route::get('my-products', [PendaftaranController::class, 'getMyPurchasedProducts']); // <--- TAMBAHKAN BARIS INI

    Route::middleware('auth:sanctum')->group(function () {
        Route::put('/sub-materi/{id}/lihat', [SubMateriStatusController::class, 'lihat']);
        Route::get('/materi/{id}/sub-materi', [SubMateriStatusController::class, 'list']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/produk/{produkId}/materis', [ProdukController::class, 'getMaterisByProduk']);
    });
});