<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubMateriUserStatus extends Model
{
    protected $fillable = ['user_id', 'sub_materi_id', 'status'];

    public function subMateri() {
        return $this->belongsTo(SubMateri::class, 'sub_materi_id');
    }
}
