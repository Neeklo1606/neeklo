<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'price_from' => 'decimal:2',
    ];

    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'mediaables')
            ->using(Mediaable::class)
            ->withPivot(['collection', 'position', 'meta'])
            ->withTimestamps()
            ->orderByPivot('position');
    }

    public function taxonomies(): MorphToMany
    {
        return $this->morphToMany(Taxonomy::class, 'taxonomable', 'taxonomables')
            ->withTimestamps();
    }
}
