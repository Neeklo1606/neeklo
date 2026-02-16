<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StoreTaxonomyRequest;
use App\Http\Requests\Admin\Cms\UpdateTaxonomyRequest;
use App\Http\Resources\Admin\Cms\TaxonomyResource;
use App\Models\Taxonomy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaxonomiesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Taxonomy::query()->with('parent');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%"));
        }
        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        $paginator = $query->orderBy('type')->orderBy('position')->orderBy('title')->paginate($perPage);

        return response()->json([
            'data' => TaxonomyResource::collection($paginator->items()),
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

    public function store(StoreTaxonomyRequest $request): JsonResponse
    {
        $taxonomy = Taxonomy::create($request->validated());
        return response()->json(['data' => new TaxonomyResource($taxonomy)], 201);
    }

    public function show(Taxonomy $taxonomy): JsonResponse
    {
        return response()->json(['data' => new TaxonomyResource($taxonomy)]);
    }

    public function update(UpdateTaxonomyRequest $request, Taxonomy $taxonomy): JsonResponse
    {
        $taxonomy->update($request->validated());
        return response()->json(['data' => new TaxonomyResource($taxonomy->fresh())]);
    }

    public function destroy(Taxonomy $taxonomy): JsonResponse
    {
        $used = DB::table('taxonomables')->where('taxonomy_id', $taxonomy->id)->exists();
        if ($used) {
            return response()->json([
                'message' => 'Невозможно удалить: таксономия используется в записях.',
            ], 422);
        }
        $taxonomy->delete();
        return response()->json(null, 204);
    }
}
