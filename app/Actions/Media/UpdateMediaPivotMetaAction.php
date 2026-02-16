<?php

namespace App\Actions\Media;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class UpdateMediaPivotMetaAction
{
    public function handle(Model $model, int $mediaId, string $collection, array $meta): void
    {
        $exists = $model->media()
            ->wherePivot('collection', $collection)
            ->wherePivot('media_id', $mediaId)
            ->exists();

        if (!$exists) {
            throw ValidationException::withMessages([
                'media_id' => ['Media not attached to this collection.'],
            ]);
        }

        $model->media()
            ->wherePivot('collection', $collection)
            ->updateExistingPivot($mediaId, ['meta' => $meta]);
    }
}
