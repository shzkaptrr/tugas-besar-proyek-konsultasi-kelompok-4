<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materi_progresses', function (Blueprint $table) {
            $table->id();
            
            // Gunakan user_id, bukan id
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            
            // Gunakan materi_id, bukan id
            $table->unsignedInteger('materi_id');
            $table->foreign('materi_id')->references('materi_id')->on('materis')->onDelete('cascade');
            
            $table->decimal('progress', 5, 2)->default(0.00); // Persentase 0 - 100
            $table->timestamps();

            $table->unique(['user_id', 'materi_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi_progresses');
    }
};
