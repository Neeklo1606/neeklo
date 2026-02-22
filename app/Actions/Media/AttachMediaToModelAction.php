<?php

namespace App\Actions\Media;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AttachMediaToModelAction
{
    public function handle(Model $model, array $mediaIds, string $collection, ?int $position, array $meta = []): void
    {
        $relation = $model->media();

        foreach ($mediaIds as $mediaId) {
            $exists = $relation->wherePivot('collection', $collection)->wherePivot('media_id', $mediaId)->exists();
            if ($exists) {
                throw ValidationException::withMessages([
                    'media_id' => ['Media already attached.'],
                ]);
            }
        }

        $existingCount = $relation->wherePivot('collection', $collection)->count();
        $insertPosition = $position !== null ? min($position, $existingCount) : $existingCount;
        $shiftCount = count($mediaIds);

        if ($insertPosition < $existingCount) {
            $this->shiftPositions($model, $collection, $insertPosition, $shiftCount);
        }

        foreach ($mediaIds as $index => $mediaId) {
            $relation->attach($mediaId, [
                'collection' => $collection,
                'position' => $insertPosition + $index,
                'meta' => $meta !== [] ? json_encode($meta) : null,
            ]);
        }

        $this->normalizePositions($model, $collection);
    }

    protected function shiftPositions(Model $model, string $collection, int $fromPosition, int $by): void
    {
        $pivots = DB::table('mediaables')
            ->where('mediable_type', $model->getMorphClass())
            ->where('mediable_id', $model->getKey())
            ->where('collection', $collection)
            ->where('position', '>=', $fromPosition)
            ->orderBy('position')
            ->get();

        foreach ($pivots as $row) {
            DB::table('mediaables')
                ->where('id', $row->id)
                ->update(['position' => $row->position + $by]);
        }
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
