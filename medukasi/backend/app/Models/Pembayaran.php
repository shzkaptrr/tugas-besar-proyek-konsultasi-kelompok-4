<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'pembayaran_id';

    protected $fillable = [
        'pendaftaran_id',
        'metode_pembayaran',
        'jumlah_pembayaran',
        'tanggal_pembayaran',
        'bukti_pembayaran',
        'status_konfirmasi',
        'tanggal_konfirmasi',
        'catatan',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'pendaftaran_id');
    }
}

