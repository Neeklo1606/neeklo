<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::query()
            ->where('status', 'published')
            ->with(['media', 'taxonomies'])
            ->orderBy('position');

        $perPage = min((int) $request->get('per_page', 15), 100);
        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => ServiceResource::collection($paginator->items()),
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
        $service = Service::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['media', 'taxonomies'])
            ->first();

        if (!$service) {
            abort(404);
        }

        return response()->json(['data' => new ServiceResource($service)]);
    }
}
