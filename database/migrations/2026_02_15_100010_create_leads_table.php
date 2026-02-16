<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('message')->nullable();
            $table->string('page_url', 1024)->nullable();
            $table->string('source', 64)->nullable();
            $table->json('utm')->nullable();
            $table->enum('status', ['new', 'in_progress', 'won', 'lost', 'spam'])->default('new');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('telegram_message_id', 128)->nullable();
            $table->timestamps();

            $table->index('phone');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
