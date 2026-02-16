<?php

namespace App\Actions\Media;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class DetachMediaFromModelAction
{
    public function handle(Model $model, int $mediaId, ?string $collection = null): void
    {
        if ($collection !== null) {
            $this->detachForCollection($model, $mediaId, $collection);
            return;
        }

        $pivots = $model->media()
            ->wherePivot('media_id', $mediaId)
            ->get(['media.id'])
            ->pluck('pivot')
            ->filter()
            ->map(fn ($p) => $p->collection)
            ->unique()
            ->values();

        if ($pivots->count() > 1) {
            throw ValidationException::withMessages([
                'collection' => ['Collection required when media is attached to multiple collections.'],
            ]);
        }

        if ($pivots->isEmpty()) {
            return;
        }

        $collection = $pivots->first();
        $this->detachForCollection($model, $mediaId, $collection);
    }

    protected function detachForCollection(Model $model, int $mediaId, string $collection): void
    {
        $model->media()
            ->wherePivot('collection', $collection)
            ->detach($mediaId);

        $this->normalizePositions($model, $collection);
    }

    protected function normalizePositions(Model $model, string $collection): void
    {
        $relation = $model->media()->wherePivot('collection', $collection)->orderByPivot('position');
        $mediaIds = $relation->pluck('media.id')->all();

        foreach ($mediaIds as $pos => $mediaId) {
            $model->media()->wherePivot('collection', $collection)->updateExistingPivot($mediaId, [
                'position' => $pos,
            ]);
        }
    }
}
