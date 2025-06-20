<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';
    protected $primaryKey = 'pendaftaran_id';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'produk_id');
    }

    // Relasi ke pembayaran
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'pendaftaran_id', 'pendaftaran_id');
    }

    // Scope untuk pendaftaran yang sudah dibayar dengan sukses
    public function scopeSukses($query)
    {
        return $query->whereHas('pembayaran', function($q) {
            $q->where('status_konfirmasi', 'sukses');
        });
    }
}