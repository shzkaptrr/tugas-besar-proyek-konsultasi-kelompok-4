<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materis'; // Nama tabel
    protected $primaryKey = 'materi_id'; // Primary key

    protected $fillable = [
        'produk_id',
        'nama_materi',
        'deskripsi',
        'urutan',
    ];

    /**
     * Get the Produk that owns the Materi.
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'produk_id');
    }

    /**
     * Get the SubMateris for the Materi.
     */
    public function subMateris()
    {
        return $this->hasMany(SubMateri::class, 'materi_id', 'materi_id');
    }
}