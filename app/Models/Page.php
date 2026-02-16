<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'og' => 'array',
        'published_at' => 'datetime',
    ];

    public function blocks(): HasMany
    {
        return $this->hasMany(PageBlock::class)->orderBy('position');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'mediaables')
            ->using(Mediaable::class)
            ->withPivot(['collection', 'position', 'meta'])
            ->withTimestamps()
            ->orderByPivot('position');
    }

    public function coverMedia(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'mediaables')
            ->using(Mediaable::class)
            ->withPivot(['collection', 'position', 'meta'])
            ->withTimestamps()
            ->wherePivot('collection', 'cover')
            ->orderByPivot('position');
    }

    public function galleryMedia(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'mediaables')
            ->using(Mediaable::class)
            ->withPivot(['collection', 'position', 'meta'])
            ->withTimestamps()
            ->wherePivot('collection', 'gallery')
            ->orderByPivot('position');
    }

    public function attachmentsMedia(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'mediaables')
            ->using(Mediaable::class)
            ->withPivot(['collection', 'position', 'meta'])
            ->withTimestamps()
            ->wherePivot('collection', 'attachments')
            ->orderByPivot('position');
    }
}
