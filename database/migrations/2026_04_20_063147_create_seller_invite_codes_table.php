<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('seller_invite_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 12)->unique();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // admin who generated
            $table->foreignId('used_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('used_at')->nullable();
            $table->boolean('is_used')->default(false);
            $table->string('note')->nullable(); // admin note
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('seller_invite_codes');
    }
};
