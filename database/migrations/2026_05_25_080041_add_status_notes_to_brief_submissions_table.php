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
        Schema::table('brief_submissions', function (Blueprint $table) {
            $table->enum('status', ['new', 'contacted', 'in_work', 'done', 'rejected'])
                  ->default('new')
                  ->after('email');
            $table->text('notes')->nullable()->after('status');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('brief_submissions', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn(['status', 'notes']);
        });
    }
};
