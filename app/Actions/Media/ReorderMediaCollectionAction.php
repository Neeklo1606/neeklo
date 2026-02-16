<?php

namespace App\Actions\Media;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReorderMediaCollectionAction
{
    public function handle(Model $model, string $collection, array $orderedMediaIds): void
    {
        $currentIds = DB::table('mediaables')
            ->where('mediable_type', $model->getMorphClass())
            ->where('mediable_id', $model->getKey())
            ->where('collection', $collection)
            ->orderBy('position')
            ->pluck('media_id')
            ->all();

        $expectedSorted = $orderedMediaIds;
        $currentSorted = $currentIds;
        sort($expectedSorted);
        sort($currentSorted);

        if ($expectedSorted !== $currentSorted) {
            throw ValidationException::withMessages([
                'order' => ['Order must exactly match current media in collection (no extras, no missing).'],
            ]);
        }

        foreach ($orderedMediaIds as $pos => $mediaId) {
            DB::table('mediaables')
                ->where('mediable_type', $model->getMorphClass())
                ->where('mediable_id', $model->getKey())
                ->where('collection', $collection)
                ->where('media_id', $mediaId)
                ->update(['position' => $pos]);
        }
    }
}
