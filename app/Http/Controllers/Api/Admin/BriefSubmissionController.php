<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BriefSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BriefSubmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 20), 100);
        $query = BriefSubmission::query();

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('company', 'like', "%{$search}%")
            );
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $paginator->items(),
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

    public function show(string $id): JsonResponse
    {
        $submission = BriefSubmission::findOrFail($id);
        return response()->json(['data' => $submission]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $submission = BriefSubmission::findOrFail($id);

        $data = $request->validate([
            'status' => 'sometimes|in:new,contacted,in_work,done,rejected',
            'notes'  => 'sometimes|nullable|string|max:5000',
        ]);

        $submission->update($data);

        return response()->json(['data' => $submission->fresh()]);
    }

    public function destroy(string $id): JsonResponse
    {
        BriefSubmission::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }

    public function counts(): JsonResponse
    {
        $counts = BriefSubmission::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statuses = ['new', 'contacted', 'in_work', 'done', 'rejected'];
        $result = [];
        foreach ($statuses as $s) {
            $result[$s] = $counts[$s] ?? 0;
        }
        $result['all'] = array_sum($result);

        return response()->json($result);
    }
}
