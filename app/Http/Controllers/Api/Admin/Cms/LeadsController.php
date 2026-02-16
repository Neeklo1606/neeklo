<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\UpdateLeadRequest;
use App\Http\Resources\Admin\Cms\LeadResource;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Lead::query()->with('assignee');

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"));
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

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => LeadResource::collection($paginator->items()),
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

    public function show(Lead $lead): JsonResponse
    {
        $lead->load('assignee');
        return response()->json(['data' => new LeadResource($lead)]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): JsonResponse
    {
        $lead->update($request->validated());
        $lead->load('assignee');
        return response()->json(['data' => new LeadResource($lead)]);
    }
}
