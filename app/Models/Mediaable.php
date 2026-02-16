<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphPivot;

class Mediaable extends MorphPivot
{
    protected $table = 'mediaables';

    protected $casts = [
        'meta' => 'array',
    ];
}
