<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Pembayaran;
use App\Observers\PembayaranObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Daftarkan observer untuk model Pembayaran
        Pembayaran::observe(PembayaranObserver::class);
    }
}
