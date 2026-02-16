<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->loadMissing(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        $mediaCollections = $this->getMediaCollections();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'h1' => $this->h1,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'template' => $this->template,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'og' => $this->og,
            'locale' => $this->locale,
            'blocks' => PageBlockResource::collection($this->whenLoaded('blocks')),
            'media_collections' => $mediaCollections,
        ];
    }

    protected function getMediaCollections(): array
    {
        $media = $this->relationLoaded('media') ? $this->media : $this->media()->get();
        $grouped = $media->groupBy(fn ($m) => $m->pivot?->collection ?? 'other');
        $result = [];
        foreach (['cover', 'gallery', 'attachments'] as $col) {
            $result[$col] = MediaResource::collection($grouped->get($col, collect())->values());
        }
        foreach ($grouped->keys() as $col) {
            if (!isset($result[$col])) {
                $result[$col] = MediaResource::collection($grouped->get($col)->values());
            }
        }
        return $result;
    }
}
