<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubMateri extends Model
{
    use HasFactory;

    protected $table = 'sub_materis'; // Nama tabel
    protected $primaryKey = 'sub_materi_id'; // Primary key

    protected $fillable = [
        'materi_id',
        'judul_sub_materi',
        'tipe_materi',
        'konten_path',
        'konten_teks',
        'durasi',
        'urutan',
    ];

    /**
     * Get the Materi that owns the SubMateri.
     */
    public function materi()
    {
        return $this->belongsTo(Materi::class, 'materi_id', 'materi_id');
    }
}