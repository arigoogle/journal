<?php

use App\Http\Controllers\Api\EntryController;
use Illuminate\Support\Facades\Route;

Route::middleware('backup.auth')->group(function () {
    Route::post('/entries', [EntryController::class, 'store']);
    Route::delete('/entries/{date}', [EntryController::class, 'destroy'])
        ->where('date', '\d{4}-\d{2}-\d{2}');
});
