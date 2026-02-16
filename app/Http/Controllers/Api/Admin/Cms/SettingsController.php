<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\BulkUpdateSettingsRequest;
use App\Http\Resources\Admin\Cms\SettingResource;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();
        if ($group = $request->get('group')) {
            $query->where('group', $group);
        }
        $settings = $query->orderBy('group')->orderBy('key')->get();
        return response()->json([
            'data' => SettingResource::collection($settings),
            'meta' => [],
        ]);
    }

    public function bulkUpdate(BulkUpdateSettingsRequest $request): JsonResponse
    {
        foreach ($request->input('settings') as $item) {
            Setting::updateOrCreate(
                ['group' => $item['group'], 'key' => $item['key']],
                ['value' => $item['value'] ?? []]
            );
        }
        $settings = Setting::query()->orderBy('group')->orderBy('key')->get();
        return response()->json(['data' => SettingResource::collection($settings)]);
    }
}
