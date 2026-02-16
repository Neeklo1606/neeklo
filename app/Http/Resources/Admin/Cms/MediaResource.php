<?php

namespace App\Http\Resources\Admin\Cms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $url = $this->resolveUrl();
        $thumbUrl = $this->type === 'photo' ? $url : $url;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'original_name' => $this->original_name,
            'extension' => $this->extension,
            'disk' => $this->disk,
            'type' => $this->type,
            'size' => $this->size,
            'width' => $this->width,
            'height' => $this->height,
            'url' => $url,
            'thumb_url' => $thumbUrl,
            'pivot' => $this->when($this->pivot, [
                'collection' => $this->pivot?->collection,
                'position' => $this->pivot?->position,
                'meta' => $this->pivot?->meta,
            ]),
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
