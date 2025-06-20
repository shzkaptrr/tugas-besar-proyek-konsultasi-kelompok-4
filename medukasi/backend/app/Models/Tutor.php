<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    protected $primaryKey = 'tutor_id';
    protected $fillable = ['user_id', 'spesialisasi', 'bio', 'pengalaman'];

    /**
     * Relasi ke model User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Relasi many-to-many ke produk
     */
    public function produks()
    {
        return $this->belongsToMany(Produk::class, 'tutor_produk', 'tutor_id', 'produk_id')
                   ->withTimestamps();
    }
}