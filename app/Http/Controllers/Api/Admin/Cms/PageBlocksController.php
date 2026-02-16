<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StorePageBlockRequest;
use App\Http\Requests\Admin\Cms\UpdatePageBlockRequest;
use App\Http\Resources\Admin\Cms\PageBlockResource;
use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageBlocksController extends Controller
{
    public function store(StorePageBlockRequest $request, Page $page): JsonResponse
    {
        $maxPosition = $page->blocks()->max('position') ?? -1;
        $block = $page->blocks()->create(array_merge($request->validated(), [
            'position' => $request->input('position', $maxPosition + 1),
        ]));
        return response()->json(['data' => new PageBlockResource($block)], 201);
    }

    public function update(UpdatePageBlockRequest $request, PageBlock $block): JsonResponse
    {
        $block->update($request->validated());
        return response()->json(['data' => new PageBlockResource($block->fresh())]);
    }

    public function destroy(PageBlock $block): JsonResponse
    {
        $block->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request, Page $page): JsonResponse
    {
        $request->validate(['block_ids' => 'required|array', 'block_ids.*' => 'integer|exists:page_blocks,id']);
        $ids = $request->input('block_ids');
        foreach ($ids as $position => $id) {
            PageBlock::where('id', $id)->where('page_id', $page->id)->update(['position' => $position]);
        }
        $page->load(['blocks' => fn ($q) => $q->orderBy('position')]);
        return response()->json(['data' => PageBlockResource::collection($page->blocks)]);
    }
}
