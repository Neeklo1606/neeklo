<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PageController extends Controller
{
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->get('locale', app()->getLocale());
        $cacheKey = "public.page.{$slug}.{$locale}";

        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return response()->json(['data' => $cached]);
        }

        $page = Page::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->with([
                'blocks' => fn ($q) => $q->where('is_enabled', true)->orderBy('position'),
                'media',
            ])
            ->first();

        if (!$page) {
            abort(404);
        }

        $data = (new PageResource($page))->resolve();
        Cache::put($cacheKey, $data, 3600);

        return response()->json(['data' => $data]);
    }
}
