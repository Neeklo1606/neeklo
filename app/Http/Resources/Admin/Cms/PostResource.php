<?php

namespace App\Http\Resources\Admin\Cms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->loadMissing(['media', 'taxonomies', 'author']);
        $mediaCollections = $this->getMediaCollections();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'author_id' => $this->author_id,
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'name' => $this->author->name,
                'email' => $this->author->email,
            ]),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'media_collections' => $mediaCollections,
            'taxonomies' => TaxonomyResource::collection($this->whenLoaded('taxonomies')),
        ];
    }

    protected function getMediaCollections(): array
    {
        $media = $this->relationLoaded('media') ? $this->media : $this->media()->get();
        $grouped = $media->groupBy(fn ($m) => $m->pivot?->collection ?? 'other');
        $result = [];
        foreach (['cover'] as $col) {
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
