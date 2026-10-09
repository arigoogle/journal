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
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->longText('content');
            $table->decimal('location_lat', 10, 7)->nullable();
            $table->decimal('location_lng', 10, 7)->nullable();
            // Source Cloudinary URL, kept so a re-sync can tell whether the
            // image changed without re-downloading it every time.
            $table->string('image_url', 2048)->nullable();
            // Local copy of that image, fetched once and stored on this
            // host — the actual point of the backup, since Cloudinary's
            // free tier is the thing most likely to run out first.
            $table->string('image_path')->nullable();
            $table->timestamps();
            // Soft-deleted rather than removed: an accidental delete in the
            // primary app shouldn't erase the backup's only copy.
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
