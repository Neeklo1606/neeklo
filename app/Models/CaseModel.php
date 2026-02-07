<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CaseModel extends Model
{
    protected $table = 'cases';

    protected $fillable = [
        'slug',
        'title',
        'category',
        'year',
        'featured',
        'description',
        'meta',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'year' => 'integer',
        'meta' => 'array',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(CaseMedia::class, 'case_id')->orderBy('order');
    }

    /** Первое изображение — обложка */
    public function getCoverAttribute(): ?string
    {
        try {
            $m = $this->media()->where('type', 'image')->orderBy('order')->first();
            return $m && $m->file_path ? $m->url : null;
        } catch (\Exception $e) {
            \Log::error('Error getting cover attribute', ['case_id' => $this->id, 'error' => $e->getMessage()]);
            return null;
        }
    }

    /** Все изображения для галереи (1–5) */
    public function getGalleryImagesAttribute(): array
    {
        try {
            return $this->media()
                ->where('type', 'image')
                ->orderBy('order')
                ->get()
                ->filter(fn ($m) => $m->file_path)
                ->map(fn ($m) => ['type' => 'image', 'src' => $m->url, 'alt' => $m->alt ?? ''])
                ->values()
                ->all();
        } catch (\Exception $e) {
            \Log::error('Error getting gallery images attribute', ['case_id' => $this->id, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /** Одно видео (опционально) */
    public function getVideoAttribute(): ?string
    {
        try {
            $m = $this->media()->where('type', 'video')->orderBy('order')->first();
            return $m && $m->file_path ? $m->url : null;
        } catch (\Exception $e) {
            \Log::error('Error getting video attribute', ['case_id' => $this->id, 'error' => $e->getMessage()]);
            return null;
        }
    }
}
