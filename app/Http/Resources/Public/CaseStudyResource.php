<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseStudyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->loadMissing(['media', 'taxonomies']);
        $mediaCollections = $this->getMediaCollections();
        $coverMedia = $this->media->first(fn ($m) => ($m->pivot->collection ?? '') === 'cover');
        $coverImage = $coverMedia ? (new MediaResource($coverMedia))->toArray($request) : null;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'short_description' => $this->short_description ?? null,
            'description' => $this->body,
            'client' => $this->client,
            'industry' => $this->industry,
            'problem' => $this->problem,
            'solution' => $this->solution,
            'result' => $this->result,
            'body' => $this->body,
            'video_url' => $this->video_url ?? null,
            'published_at' => $this->published_at?->toIso8601String(),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'cover_image' => $coverImage,
            'media_collections' => $mediaCollections,
            'gallery' => $mediaCollections['gallery'] ?? [],
            'taxonomies' => TaxonomyResource::collection($this->whenLoaded('taxonomies')),
            'category' => $this->taxonomies->first()?->title ?? $this->industry,
        ];
    }

    protected function getMediaCollections(): array
    {
        $media = $this->relationLoaded('media') ? $this->media : $this->media()->get();
        $grouped = $media->groupBy(fn ($m) => $m->pivot?->collection ?? 'other');
        $result = [];
        foreach (['cover', 'gallery', 'card_gallery', 'video'] as $col) {
            $items = $grouped->get($col, collect())->values();
            if ($col === 'card_gallery') {
                $items = $items->take(5);
            }
            $result[$col] = MediaResource::collection($items);
        }
        foreach ($grouped->keys() as $col) {
            if (!array_key_exists($col, $result)) {
                $result[$col] = MediaResource::collection($grouped->get($col)->values());
            }
        }
        return $result;
    }
}
