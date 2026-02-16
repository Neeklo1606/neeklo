<?php

namespace App\Http\Resources\Admin\Cms;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'menu_id' => $this->menu_id,
            'parent_id' => $this->parent_id,
            'type' => $this->type,
            'label' => $this->label,
            'url' => $this->url,
            'ref_id' => $this->ref_id,
            'position' => $this->position,
            'is_enabled' => $this->is_enabled,
            'meta' => $this->meta,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'children' => self::collection($this->whenLoaded('children')),
        ];
    }
}
