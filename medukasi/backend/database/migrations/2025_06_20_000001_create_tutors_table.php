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
        Schema::create('tutors', function (Blueprint $table) {
            $table->id('tutor_id');
            $table->unsignedBigInteger('user_id'); // Relasi ke tabel users
            $table->string('spesialisasi')->nullable(); // Spesialisasi tutor (misalnya: "Matematika", "Bahasa Inggris", dll)
            $table->text('bio')->nullable(); // Deskripsi singkat tentang tutor
            $table->string('pengalaman')->nullable(); // Tahun pengalaman mengajar
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutors');
    }
};