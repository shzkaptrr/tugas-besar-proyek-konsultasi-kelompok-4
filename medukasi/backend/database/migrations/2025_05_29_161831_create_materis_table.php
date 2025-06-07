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
        Schema::create('materis', function (Blueprint $table) {
            $table->increments('materi_id'); // Primary Key (Module ID)
            $table->unsignedBigInteger('produk_id'); // Foreign Key to produks table
            $table->string('nama_materi'); // Module Name
            $table->text('deskripsi')->nullable(); // Module Description
            $table->integer('urutan'); // Order of module within a product
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('produk_id')->references('produk_id')->on('produks')->onDelete('cascade');

            // Add index for faster lookups
            $table->index('produk_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materis');
    }
};