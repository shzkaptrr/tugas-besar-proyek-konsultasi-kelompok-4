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
        Schema::create('tutor_produk', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tutor_id');
            $table->unsignedBigInteger('produk_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('tutor_id')->references('tutor_id')->on('tutors')->onDelete('cascade');
            $table->foreign('produk_id')->references('produk_id')->on('produks')->onDelete('cascade');
            
            // Unique constraint to prevent duplicate assignments
            $table->unique(['tutor_id', 'produk_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutor_produk');
    }
};