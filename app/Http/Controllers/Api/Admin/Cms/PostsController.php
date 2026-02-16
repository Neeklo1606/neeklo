<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\StorePostRequest;
use App\Http\Requests\Admin\Cms\UpdatePostRequest;
use App\Http\Resources\Admin\Cms\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 100);
        $query = Post::query()->with(['media', 'taxonomies', 'author']);

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
            'data' => PostResource::collection($paginator->items()),
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

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = Post::create($request->validated());
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)], 201);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $post->update($request->validated());
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json(null, 204);
    }
}
