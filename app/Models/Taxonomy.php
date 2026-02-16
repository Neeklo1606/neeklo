<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Taxonomy extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position');
    }

    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taxonomable', 'taxonomables')
            ->withTimestamps();
    }

    public function services(): MorphToMany
    {
        return $this->morphedByMany(Service::class, 'taxonomable', 'taxonomables')
            ->withTimestamps();
    }

    public function caseStudies(): MorphToMany
    {
        return $this->morphedByMany(CaseStudy::class, 'taxonomable', 'taxonomables')
            ->withTimestamps();
    }

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function isCategory(): bool
    {
        return $this->type === 'category';
    }

    public function isTag(): bool
    {
        return $this->type === 'tag';
    }
}
