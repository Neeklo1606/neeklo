<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StoreMenuItemRequest;
use App\Http\Requests\Admin\Cms\UpdateMenuItemRequest;
use App\Http\Resources\Admin\Cms\MenuItemResource;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemsController extends Controller
{
    public function store(StoreMenuItemRequest $request, Menu $menu): JsonResponse
    {
        $data = $request->validated();
        $data['menu_id'] = $menu->id;
        $data['is_enabled'] = $data['is_enabled'] ?? true;
        $data['position'] = $data['position'] ?? 0;
        $item = MenuItem::create($data);
        $item->load('children');
        return response()->json(['data' => new MenuItemResource($item)], 201);
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menu_item): JsonResponse
    {
        $menu_item->update($request->validated());
        $menu_item->load('children');
        return response()->json(['data' => new MenuItemResource($menu_item->fresh())]);
    }

    public function destroy(MenuItem $menu_item): JsonResponse
    {
        $menu_item->delete();
        return response()->json(null, 204);
    }

    public function tree(Menu $menu): JsonResponse
    {
        $items = $menu->items()->with('children')->whereNull('parent_id')->orderBy('position')->get();
        return response()->json(['data' => MenuItemResource::collection($items)]);
    }

    public function reorder(Request $request, Menu $menu): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:menu_items,id',
            'items.*.position' => 'required|integer|min:0',
            'items.*.parent_id' => 'nullable|integer|exists:menu_items,id',
        ]);
        $items = $request->input('items');
        foreach ($items as $item) {
            $newParentId = $item['parent_id'] ?? null;
            if ($newParentId && $this->wouldCreateCycle($items, $item['id'], $newParentId)) {
                return response()->json([
                    'message' => 'Невозможно установить родителя: создаётся цикл.',
                ], 422);
            }
        }
        foreach ($items as $item) {
            MenuItem::where('id', $item['id'])->where('menu_id', $menu->id)->update([
                'position' => $item['position'],
                'parent_id' => $item['parent_id'] ?? null,
            ]);
        }
        $items = $menu->items()->with('children')->whereNull('parent_id')->orderBy('position')->get();
        return response()->json(['data' => MenuItemResource::collection($items)]);
    }

    protected function wouldCreateCycle(array $items, int $itemId, int $newParentId): bool
    {
        $id = $newParentId;
        $seen = [$itemId => true];
        while ($id !== null) {
            if (isset($seen[$id])) {
                return true;
            }
            $seen[$id] = true;
            $parent = collect($items)->firstWhere('id', $id);
            $id = $parent['parent_id'] ?? null;
        }
        return false;
    }
}
