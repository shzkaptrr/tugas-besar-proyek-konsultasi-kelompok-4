<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';
    protected $primaryKey = 'pendaftaran_id';

    protected $fillable = [
        'user_id',
        'produk_id',
        'tanggal_pendaftaran',
        'sumber_informasi',
        'asal_sekolah',
        'no_telp_ortu',
        'status', // Kolom status pendaftaran, bukan status pembayaran
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'produk_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id'); // Sesuaikan foreign key user_id ke primary key 'id' di tabel users
    }

    public function pembayaran() // <--- TAMBAHKAN RELASI INI
    {
        return $this->hasMany(Pembayaran::class, 'pendaftaran_id', 'pendaftaran_id');
    }
}