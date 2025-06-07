<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePembayaransTable extends Migration
{
    public function up()
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id('pembayaran_id'); // auto increment bigint unsigned
            $table->unsignedBigInteger('pendaftaran_id');
            $table->string('metode_pembayaran', 50);
            $table->decimal('jumlah_pembayaran', 10, 2);
            $table->date('tanggal_pembayaran')->nullable();
            $table->string('bukti_pembayaran')->nullable();
            $table->enum('status_konfirmasi', ['menunggu', 'sukses', 'gagal'])->default('menunggu');
            $table->date('tanggal_konfirmasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps(); // created_at dan updated_at

            // Foreign key ke tabel pendaftaran (jika ada)
            $table->foreign('pendaftaran_id')->references('pendaftaran_id')->on('pendaftaran')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pembayaran');
    }
}
