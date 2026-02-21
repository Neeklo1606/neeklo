<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\CaseStudyResource;
use App\Models\CaseStudy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CaseStudy::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->with(['media', 'taxonomies'])
            ->orderBy('published_at', 'desc');

        $perPage = min((int) $request->get('per_page', 15), 100);
        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => CaseStudyResource::collection($paginator->items()),
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

    public function show(string $slug): JsonResponse
    {
        $caseStudy = CaseStudy::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->with(['media', 'taxonomies'])
            ->first();

        if (!$caseStudy) {
            abort(404);
        }

        return response()->json(['data' => new CaseStudyResource($caseStudy)]);
    }

    public function related(string $slug, Request $request): JsonResponse
    {
        $caseStudy = CaseStudy::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['media', 'taxonomies'])
            ->first();

        if (!$caseStudy) {
            abort(404);
        }

        $limit = min((int) $request->get('limit', 4), 12);
        $taxonomyIds = $caseStudy->taxonomies->pluck('id')->filter()->values()->all();
        $industry = $caseStudy->industry;

        $query = CaseStudy::query()
            ->where('status', 'published')
            ->where('id', '!=', $caseStudy->id)
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->with(['media', 'taxonomies'])
            ->orderBy('published_at', 'desc');

        if (count($taxonomyIds) > 0) {
            $query->whereHas('taxonomies', fn ($q) => $q->whereIn('taxonomies.id', $taxonomyIds));
        } elseif ($industry) {
            $query->where('industry', $industry);
        }

        $related = $query->limit($limit)->get();

        if ($related->count() < $limit) {
            $excludeIds = $related->pluck('id')->push($caseStudy->id)->all();
            $extra = CaseStudy::query()
                ->where('status', 'published')
                ->where(function ($q) {
                    $q->whereNull('published_at')->orWhere('published_at', '<=', now());
                })
                ->whereNotIn('id', $excludeIds)
                ->with(['media', 'taxonomies'])
                ->orderBy('published_at', 'desc')
                ->limit($limit - $related->count())
                ->get();
            $related = $related->merge($extra);
        }

        return response()->json(['data' => CaseStudyResource::collection($related)]);
    }
}
