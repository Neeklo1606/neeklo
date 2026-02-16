<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StoreCaseStudyRequest;
use App\Http\Requests\Admin\Cms\UpdateCaseStudyRequest;
use App\Http\Resources\Admin\Cms\CaseStudyResource;
use App\Models\CaseStudy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CaseStudiesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = CaseStudy::query()->with(['media', 'taxonomies']);

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

    public function store(StoreCaseStudyRequest $request): JsonResponse
    {
        $caseStudy = CaseStudy::create($request->validated());
        $caseStudy->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($caseStudy)], 201);
    }

    public function show(CaseStudy $case_study): JsonResponse
    {
        $case_study->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($case_study)]);
    }

    public function update(UpdateCaseStudyRequest $request, CaseStudy $case_study): JsonResponse
    {
        $case_study->update($request->validated());
        $case_study->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($case_study)]);
    }

    public function destroy(CaseStudy $case_study): JsonResponse
    {
        $case_study->delete();
        return response()->json(null, 204);
    }
}
