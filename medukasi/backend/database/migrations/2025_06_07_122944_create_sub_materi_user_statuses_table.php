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
        Schema::create('sub_materi_user_statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->unsignedInteger('sub_materi_id');
            $table->foreign('sub_materi_id')->references('sub_materi_id')->on('sub_materis')->onDelete('cascade');
            $table->enum('status', ['buka', 'lihat'])->default('buka');
            $table->timestamps();

            $table->unique(['user_id', 'sub_materi_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_materi_user_statuses');
    }
};
