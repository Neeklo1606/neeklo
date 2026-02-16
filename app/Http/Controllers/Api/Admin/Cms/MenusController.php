<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StoreMenuRequest;
use App\Http\Requests\Admin\Cms\UpdateMenuRequest;
use App\Http\Resources\Admin\Cms\MenuResource;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenusController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Menu::query();

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('key', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%"));
        }

        $paginator = $query->orderBy('key')->paginate($perPage);

        return response()->json([
            'data' => MenuResource::collection($paginator->items()),
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

    public function store(StoreMenuRequest $request): JsonResponse
    {
        $menu = Menu::create($request->validated());
        return response()->json(['data' => new MenuResource($menu)], 201);
    }

    public function show(Menu $menu): JsonResponse
    {
        return response()->json(['data' => new MenuResource($menu)]);
    }

    public function update(UpdateMenuRequest $request, Menu $menu): JsonResponse
    {
        $menu->update($request->validated());
        return response()->json(['data' => new MenuResource($menu->fresh())]);
    }

    public function destroy(Menu $menu): JsonResponse
    {
        $menu->items()->delete();
        $menu->delete();
        return response()->json(null, 204);
    }
}
