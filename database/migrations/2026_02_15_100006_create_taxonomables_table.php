<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taxonomables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('taxonomy_id')->constrained('taxonomies')->cascadeOnDelete();
            $table->string('taxonomable_type');
            $table->unsignedBigInteger('taxonomable_id');
            $table->timestamps();

            $table->index(['taxonomable_type', 'taxonomable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taxonomables');
    }
};
