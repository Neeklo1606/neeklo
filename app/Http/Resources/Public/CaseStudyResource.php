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

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'client' => $this->client,
            'industry' => $this->industry,
            'problem' => $this->problem,
            'solution' => $this->solution,
            'result' => $this->result,
            'body' => $this->body,
            'published_at' => $this->published_at?->toIso8601String(),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'media_collections' => $mediaCollections,
            'taxonomies' => TaxonomyResource::collection($this->whenLoaded('taxonomies')),
        ];
    }

    protected function getMediaCollections(): array
    {
        $media = $this->relationLoaded('media') ? $this->media : $this->media()->get();
        $grouped = $media->groupBy(fn ($m) => $m->pivot?->collection ?? 'other');
        $result = [];
        foreach (['cover', 'gallery'] as $col) {
            $result[$col] = MediaResource::collection($grouped->get($col, collect())->values());
        }
        foreach ($grouped->keys() as $col) {
            if (!array_key_exists($col, $result)) {
                $result[$col] = MediaResource::collection($grouped->get($col)->values());
            }
        }
        return $result;
    }
}
