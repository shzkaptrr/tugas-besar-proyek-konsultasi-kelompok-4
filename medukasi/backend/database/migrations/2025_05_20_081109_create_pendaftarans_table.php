<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePendaftaransTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (!Schema::hasTable('pendaftaran')) {
            Schema::create('pendaftaran', function (Blueprint $table) {
                $table->id('pendaftaran_id');
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('produk_id');
                $table->date('tanggal_pendaftaran')->default(now());
                $table->string('sumber_informasi');
                $table->string('asal_sekolah');
                $table->string('no_telp_ortu');
                $table->string('status')->default('menunggu');
                $table->timestamps();

                $table->foreign('produk_id')->references('produk_id')->on('produks');
                $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            });
        }
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
}
