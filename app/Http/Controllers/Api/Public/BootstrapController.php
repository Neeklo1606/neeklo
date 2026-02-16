<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\MenuResource;
use App\Http\Resources\Public\SettingResource;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BootstrapController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $locale = $request->get('locale', app()->getLocale());

        $data = Cache::remember("public.bootstrap.{$locale}", 3600, function () {
            $settings = Setting::query()
                ->whereIn('group', ['contacts', 'social', 'seo'])
                ->orderBy('group')
                ->orderBy('key')
                ->get()
                ->groupBy('group')
                ->map(fn ($items) => SettingResource::collection($items)->resolve());

            $menuKeys = ['header', 'footer', 'mobile'];
            $menus = Menu::query()
                ->whereIn('key', $menuKeys)
                ->get()
                ->mapWithKeys(function (Menu $menu) {
                    $menu->setRelation('items', $this->buildMenuTree($menu->id));
                    $res = (new MenuResource($menu))->resolve();
                    return [$menu->key => $res];
                })
                ->all();

            return [
                'settings' => $settings,
                'menus' => $menus,
            ];
        });

        return response()->json(['data' => $data]);
    }

    protected function buildMenuTree(int $menuId): \Illuminate\Database\Eloquent\Collection
    {
        return MenuItem::query()
            ->where('menu_id', $menuId)
            ->whereNull('parent_id')
            ->where('is_enabled', true)
            ->with(['children' => fn ($q) => $q->where('is_enabled', true)
                ->with(['children' => fn ($q2) => $q2->where('is_enabled', true)->orderBy('position')])
                ->orderBy('position')])
            ->orderBy('position')
            ->get();
    }
}
