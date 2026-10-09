<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JournalEntry extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'date',
        'content',
        'location_lat',
        'location_lng',
        'image_url',
        'image_path',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'location_lat' => 'float',
        'location_lng' => 'float',
    ];
}
