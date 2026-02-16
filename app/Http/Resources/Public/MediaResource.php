<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $url = $this->resolveUrl();

        return [
            'id' => $this->id,
            'url' => $url,
            'type' => $this->type,
            'width' => $this->width,
            'height' => $this->height,
            'collection' => $this->pivot?->collection,
            'position' => $this->pivot?->position,
        ];
    }

    protected function resolveUrl(): string
    {
        $metadata = $this->metadata ? json_decode($this->metadata, true) : [];
        $path = $metadata['path'] ?? ($this->disk . '/' . $this->name);

        $disk = $this->disk;
        if (config("filesystems.disks.{$disk}")) {
            return Storage::disk($disk)->url($path);
        }

        return url('/' . ltrim($path, '/'));
    }
}
