<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxonomySyncController extends Controller
{
    public function syncService(Request $request, Service $service): JsonResponse
    {
        $request->validate(['taxonomy_ids' => 'nullable|array', 'taxonomy_ids.*' => 'integer|exists:taxonomies,id']);
        $service->taxonomies()->sync($request->input('taxonomy_ids', []));
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new \App\Http\Resources\Admin\Cms\ServiceResource($service)]);
    }

    public function syncCaseStudy(Request $request, CaseStudy $case_study): JsonResponse
    {
        $request->validate(['taxonomy_ids' => 'nullable|array', 'taxonomy_ids.*' => 'integer|exists:taxonomies,id']);
        $case_study->taxonomies()->sync($request->input('taxonomy_ids', []));
        $case_study->load(['media', 'taxonomies']);
        return response()->json(['data' => new \App\Http\Resources\Admin\Cms\CaseStudyResource($case_study)]);
    }

    public function syncPost(Request $request, Post $post): JsonResponse
    {
        $request->validate(['taxonomy_ids' => 'nullable|array', 'taxonomy_ids.*' => 'integer|exists:taxonomies,id']);
        $post->taxonomies()->sync($request->input('taxonomy_ids', []));
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new \App\Http\Resources\Admin\Cms\PostResource($post)]);
    }
}
