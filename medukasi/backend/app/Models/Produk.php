<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    // Nama tabel (opsional jika sesuai konvensi)
    protected $table = 'produks';

    // Primary key yang bukan 'id'
    protected $primaryKey = 'produk_id';

    // Kolom yang boleh diisi secara mass assignment
    protected $fillable = [
        'nama_produk',
        'deskripsi_produk',
        'harga',
        'status'
    ];

    // Jika Anda ingin mendapatkan materi dari produk
    public function materis()
    {
        return $this->hasMany(Materi::class, 'produk_id', 'produk_id');
    }
}
