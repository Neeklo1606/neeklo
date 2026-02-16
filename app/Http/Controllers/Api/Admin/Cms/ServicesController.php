<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StoreServiceRequest;
use App\Http\Requests\Admin\Cms\UpdateServiceRequest;
use App\Http\Resources\Admin\Cms\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Service::query()->with(['media', 'taxonomies']);

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%"));
        }
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }
        if ($dateFrom = $request->get('date_from')) {
            $query->where('created_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->get('date_to')) {
            $query->where('created_at', '<=', $dateTo);
        }

        $paginator = $query->orderBy('position')->orderBy('updated_at', 'desc')->paginate($perPage);

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

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)], 201);
    }

    public function show(Service $service): JsonResponse
    {
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $service->update($request->validated());
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();
        return response()->json(null, 204);
    }
}
