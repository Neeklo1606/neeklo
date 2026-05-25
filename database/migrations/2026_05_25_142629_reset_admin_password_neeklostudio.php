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
        \DB::table('users')
            ->where('email', 'neeklostudio@gmail.com')
            ->update(['password' => \Hash::make('123123123')]);
    }

    public function down(): void
    {
        // irreversible
    }
};
