<?php

namespace App\Console\Commands;

use App\Models\Materi;
use App\Models\Pembayaran;
use App\Models\SubMateri;
use App\Models\SubMateriUserStatus;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProsesSubMateriStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sub-materi:proses {pembayaran_id? : ID Pembayaran spesifik yang akan diproses} {--all : Proses semua pembayaran sukses yang belum diproses}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Proses status sub materi untuk pembayaran sukses';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pembayaranId = $this->argument('pembayaran_id');
        $processAll = $this->option('all');

        if ($pembayaranId) {
            $this->info("Memproses pembayaran ID: {$pembayaranId}");
            
            $pembayaran = Pembayaran::find($pembayaranId);
            if (!$pembayaran) {
                $this->error("Pembayaran dengan ID {$pembayaranId} tidak ditemukan");
                return 1;
            }

            $this->prosesPembayaran($pembayaran);
        } elseif ($processAll) {
            $this->info("Memproses semua pembayaran dengan status sukses");
            
            $pembayarans = Pembayaran::where('status_konfirmasi', 'sukses')->get();
            $this->info("Ditemukan {$pembayarans->count()} pembayaran dengan status sukses");
            
            foreach ($pembayarans as $pembayaran) {
                $this->prosesPembayaran($pembayaran);
            }
        } else {
            $this->error('Harap tentukan ID pembayaran atau gunakan flag --all');
            return 1;
        }

        $this->info("Proses selesai");
        return 0;
    }

    /**
     * Proses satu pembayaran untuk membuat status sub materi
     */
    private function prosesPembayaran(Pembayaran $pembayaran)
    {
        $this->info("Processing pembayaran ID: {$pembayaran->pembayaran_id}");
        
        if ($pembayaran->status_konfirmasi !== 'sukses') {
            $this->warn("Pembayaran ID: {$pembayaran->pembayaran_id} status: {$pembayaran->status_konfirmasi} - skipping");
            return;
        }

        $pendaftaran = $pembayaran->pendaftaran;
        if (!$pendaftaran) {
            $this->error("Pendaftaran tidak ditemukan untuk pembayaran ID: {$pembayaran->pembayaran_id}");
            return;
        }

        $user_id = $pendaftaran->user_id;
        $produk_id = $pendaftaran->produk_id;
        
        $this->info("User ID: {$user_id}, Produk ID: {$produk_id}");

        // Ambil semua materi dari produk
        $materis = Materi::where('produk_id', $produk_id)->get();
        $this->info("Ditemukan {$materis->count()} materi untuk produk ID: {$produk_id}");
        
        $totalSubMateri = 0;
        $totalCreatedStatus = 0;
        $totalExistingStatus = 0;

        // Loop melalui semua materi dan sub-materi
        foreach ($materis as $materi) {
            $subMateris = SubMateri::where('materi_id', $materi->materi_id)->get();
            $this->info("Materi ID {$materi->materi_id}: {$materi->nama_materi} memiliki {$subMateris->count()} sub-materi");
            
            $totalSubMateri += $subMateris->count();
            
            foreach ($subMateris as $subMateri) {
                try {
                    // Cek apakah status sudah ada
                    $existingStatus = SubMateriUserStatus::where('user_id', $user_id)
                        ->where('sub_materi_id', $subMateri->sub_materi_id)
                        ->first();
                    
                    if ($existingStatus) {
                        $this->line("  - Status untuk sub-materi ID {$subMateri->sub_materi_id} sudah ada: {$existingStatus->status}");
                        $totalExistingStatus++;
                    } else {
                        // Buat status baru
                        $status = new SubMateriUserStatus();
                        $status->user_id = $user_id;
                        $status->sub_materi_id = $subMateri->sub_materi_id;
                        $status->status = 'buka';
                        $status->save();
                        
                        $this->line("  + Dibuat status baru untuk sub-materi ID {$subMateri->sub_materi_id}: buka");
                        $totalCreatedStatus++;
                    }
                } catch (\Exception $e) {
                    $this->error("Error saat membuat status untuk sub-materi ID {$subMateri->sub_materi_id}: {$e->getMessage()}");
                    Log::error("Error saat membuat status sub-materi", [
                        'error' => $e->getMessage(),
                        'sub_materi_id' => $subMateri->sub_materi_id,
                        'user_id' => $user_id
                    ]);
                }
            }
        }
        
        $this->info("Pembayaran ID {$pembayaran->pembayaran_id}: Total {$totalSubMateri} sub-materi, {$totalCreatedStatus} status baru dibuat, {$totalExistingStatus} status sudah ada");
    }
}