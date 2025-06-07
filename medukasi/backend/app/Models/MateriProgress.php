<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MateriProgress extends Model
{
    protected $fillable = ['user_id', 'materi_id', 'progress'];
}
