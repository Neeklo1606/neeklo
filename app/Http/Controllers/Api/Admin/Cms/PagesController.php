<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StorePageRequest;
use App\Http\Requests\Admin\Cms\UpdatePageRequest;
use App\Http\Resources\Admin\Cms\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PagesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Page::query()->with(['blocks' => fn ($q) => $q->orderBy('position')]);

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%"));
        }
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }
        if ($dateFrom = $request->get('date_from')) {
            $query->where('published_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->get('date_to')) {
            $query->where('published_at', '<=', $dateTo);
        }

        $paginator = $query->orderBy('updated_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => PageResource::collection($paginator->items()),
            'meta' => [
                'pagination' => [
                    'total' => $paginator->total(),
                    'per_page' => $paginator->perPage(),
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                ],
            ],
        ]);
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $page = Page::create($request->validated());
        $page->load(['blocks', 'media']);
        return response()->json(['data' => new PageResource($page)], 201);
    }

    public function show(Page $page): JsonResponse
    {
        $page->load(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function update(UpdatePageRequest $request, Page $page): JsonResponse
    {
        $page->update($request->validated());
        $page->load(['blocks', 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function destroy(Page $page): JsonResponse
    {
        $page->delete();
        return response()->json(null, 204);
    }
}
