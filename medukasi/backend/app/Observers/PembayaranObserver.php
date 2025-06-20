<?php

namespace App\Observers;

use App\Models\Materi;
use App\Models\Pembayaran;
use App\Models\SubMateri;
use App\Models\SubMateriUserStatus;
use App\Models\Pendaftaran;

class PembayaranObserver
{
    /**
     * Handle the Pembayaran "updated" event.
     *
     * @param  \App\Models\Pembayaran  $pembayaran
     * @return void
     */
    public function updated(Pembayaran $pembayaran)
    {
        // Debug log pada awal function
        \Log::debug('PembayaranObserver: pembayaran diupdate', [
            'pembayaran_id' => $pembayaran->pembayaran_id,
            'status_konfirmasi' => $pembayaran->status_konfirmasi,
            'isDirty' => $pembayaran->isDirty('status_konfirmasi'),
            'wasChanged' => $pembayaran->wasChanged('status_konfirmasi'),
            'original' => $pembayaran->getOriginal('status_konfirmasi'),
            'current' => $pembayaran->status_konfirmasi
        ]);

        // Cek apakah status pembayaran berubah menjadi 'sukses' ATAU baru saja dibuat dengan status 'sukses'
        if (
            // Cek perubahan ke status sukses
            ($pembayaran->wasChanged('status_konfirmasi') && $pembayaran->status_konfirmasi === 'sukses') ||
            // Cek jika status awalnya sudah sukses (untuk pembayaran yang sudah diupdate di database)
            (!$pembayaran->wasChanged('status_konfirmasi') && $pembayaran->status_konfirmasi === 'sukses')
        ) {
            
            \Log::debug('PembayaranObserver: Status sukses terdeteksi, memproses...');
            
            // Ambil pendaftaran yang terkait dengan pembayaran
            $pendaftaran = $pembayaran->pendaftaran;
            
            // Pastikan pendaftaran ditemukan
            if (!$pendaftaran) {
                \Log::error('PembayaranObserver: Pendaftaran tidak ditemukan untuk pembayaran ID: ' . $pembayaran->pembayaran_id);
                return;
            }
            
            // Update status pendaftaran menjadi 'sukses'
            $pendaftaran->status = 'sukses';
            $pendaftaran->save();
            
            \Log::info('PembayaranObserver: Status pendaftaran diupdate menjadi sukses', [
                'pembayaran_id' => $pembayaran->pembayaran_id,
                'pendaftaran_id' => $pendaftaran->pendaftaran_id
            ]);
            
            $user_id = $pendaftaran->user_id;
            $produk_id = $pendaftaran->produk_id;
            
            \Log::debug('PembayaranObserver: Info pendaftaran:', [
                'pendaftaran_id' => $pendaftaran->pendaftaran_id,
                'user_id' => $user_id,
                'produk_id' => $produk_id
            ]);
            
            // Ambil semua materi dari produk yang dibeli
            $materis = Materi::where('produk_id', $produk_id)->get();
            
            \Log::debug('PembayaranObserver: Jumlah materi ditemukan: ' . $materis->count(), [
                'materis_ids' => $materis->pluck('materi_id')->toArray()
            ]);
            
            // Loop melalui semua materi
            foreach ($materis as $materi) {
                // Ambil semua sub-materi
                $subMateris = SubMateri::where('materi_id', $materi->materi_id)->get();
                
                \Log::debug('PembayaranObserver: Materi ' . $materi->materi_id . ' memiliki ' . $subMateris->count() . ' sub-materi');
                
                // Loop melalui semua sub-materi
                foreach ($subMateris as $subMateri) {
                    try {
                        // Tambahkan atau update status user untuk sub materi tersebut
                        $status = SubMateriUserStatus::firstOrCreate(
                            [
                                'user_id' => $user_id,
                                'sub_materi_id' => $subMateri->sub_materi_id
                            ],
                            [
                                'status' => 'buka' // Status default
                            ]
                        );
                        
                        \Log::debug('PembayaranObserver: Sub-materi status dibuat/diupdate', [
                            'sub_materi_id' => $subMateri->sub_materi_id,
                            'user_id' => $user_id,
                            'is_new' => $status->wasRecentlyCreated ? 'Ya' : 'Tidak'
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('PembayaranObserver: Error saat membuat status sub-materi', [
                            'error' => $e->getMessage(),
                            'sub_materi_id' => $subMateri->sub_materi_id,
                            'user_id' => $user_id,
                            'trace' => $e->getTraceAsString()
                        ]);
                    }
                }
            }
            
            \Log::info('PembayaranObserver: Proses otomatisasi selesai - akses materi diberikan', [
                'pembayaran_id' => $pembayaran->pembayaran_id,
                'user_id' => $user_id,
                'produk_id' => $produk_id
            ]);
        } else {
            \Log::debug('PembayaranObserver: Status tidak berubah menjadi sukses, tidak ada tindakan');
        }
    }

    /**
     * Handle the Pembayaran "created" event.
     * Ini akan dipicu saat pembayaran baru dibuat
     */
    public function created(Pembayaran $pembayaran)
    {
        \Log::debug('PembayaranObserver: Pembayaran baru dibuat', [
            'pembayaran_id' => $pembayaran->pembayaran_id,
            'status_konfirmasi' => $pembayaran->status_konfirmasi
        ]);

        // Jika pembayaran dibuat dengan status sukses, berikan akses materi
        if ($pembayaran->status_konfirmasi === 'sukses') {
            $this->updated($pembayaran);
        }
    }
}