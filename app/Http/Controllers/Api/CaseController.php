<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseMedia;
use App\Models\CaseModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CaseController extends Controller
{
    /** Список кейсов (публичный, для сайта) */
    public function index(): JsonResponse
    {
        try {
            $cases = CaseModel::with('media')
                ->orderBy('year', 'desc')
                ->orderBy('title')
                ->get();

            $data = $cases->map(function ($c) {
                try {
                    return [
                        'id' => $c->id,
                        'slug' => $c->slug,
                        'title' => $c->title,
                        'category' => $c->category,
                        'year' => $c->year,
                        'featured' => $c->featured,
                        'description' => $c->description,
                        'meta' => $c->meta,
                        'cover' => $c->cover ?? null,
                        'video' => $c->video ?? null,
                        'gallery' => $c->gallery_images ?? [],
                    ];
                } catch (\Exception $e) {
                    Log::error('Error mapping case', [
                        'case_id' => $c->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                    return [
                        'id' => $c->id,
                        'slug' => $c->slug ?? '',
                        'title' => $c->title ?? '',
                        'category' => $c->category ?? '',
                        'year' => $c->year ?? null,
                        'featured' => $c->featured ?? false,
                        'description' => $c->description ?? '',
                        'meta' => $c->meta ?? [],
                        'cover' => null,
                        'video' => null,
                        'gallery' => [],
                    ];
                }
            });

            return response()->json(['data' => $data]);
        } catch (\Exception $e) {
            Log::error('CaseController@index error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Ошибка загрузки кейсов',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /** Кейс по slug (публичный) */
    public function showBySlug(string $slug): JsonResponse
    {
        $case = CaseModel::with('media')->where('slug', $slug)->firstOrFail();
        return $this->showResponse($case);
    }

    /** Кейс по id (админ, для формы редактирования) */
    public function show(int $id): JsonResponse
    {
        $case = CaseModel::with('media')->findOrFail($id);
        return $this->showResponse($case);
    }

    private function showResponse(CaseModel $case): JsonResponse
    {
        return response()->json([
            'data' => [
                'id' => $case->id,
                'slug' => $case->slug,
                'title' => $case->title,
                'category' => $case->category,
                'year' => $case->year,
                'featured' => $case->featured,
                'description' => $case->description,
                'meta' => $case->meta,
                'cover' => $case->cover,
                'video' => $case->video,
                'gallery' => $case->gallery_images,
                'media' => $case->media->map(fn ($m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'url' => $m->url,
                    'file_path' => $m->file_path,
                    'order' => $m->order,
                ])->values(),
            ],
        ]);
    }

    /** Создание кейса (админ) */
    public function store(Request $request): JsonResponse
    {
        $v = $request->validate([
            'slug' => 'required|string|max:120|unique:cases,slug',
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:80',
            'year' => 'nullable|integer|min:1990|max:2100',
            'featured' => 'boolean',
            'description' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);

        $v['featured'] = $request->boolean('featured', false);
        $case = CaseModel::create($v);
        return response()->json(['success' => true, 'data' => $case], 201);
    }

    /** Обновление кейса (админ) */
    public function update(Request $request, int $id): JsonResponse
    {
        $case = CaseModel::findOrFail($id);
        $v = $request->validate([
            'slug' => 'sometimes|string|max:120|unique:cases,slug,' . $case->id,
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:80',
            'year' => 'nullable|integer|min:1990|max:2100',
            'featured' => 'boolean',
            'description' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);

        $case->update($v);
        return response()->json(['success' => true, 'data' => $case->fresh()]);
    }

    /**
     * Загрузка медиа для кейса.
     * Изображения: jpeg/png/webp, до 2MB. Видео: mp4/webm, до 50MB.
     * Путь: storage/app/public/cases/{case_slug}/
     */
    public function uploadCaseMedia(Request $request, int $caseId): JsonResponse
    {
        $case = CaseModel::findOrFail($caseId);
        $file = $request->file('file');
        $type = $request->input('type', 'image');

        if (!$file) {
            return response()->json(['success' => false, 'message' => 'Файл не передан'], 422);
        }

        if (!in_array($type, ['image', 'video'])) {
            return response()->json(['success' => false, 'message' => 'type должен быть image или video'], 422);
        }

        $mime = $file->getMimeType();
        $ext = strtolower($file->getClientOriginalExtension());

        if ($type === 'image') {
            $allowed = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($mime, $allowed)) {
                return response()->json(['success' => false, 'message' => 'Изображение: только JPEG, PNG, WebP'], 422);
            }
            if ($file->getSize() > 2 * 1024 * 1024) {
                return response()->json(['success' => false, 'message' => 'Изображение до 2 MB'], 422);
            }
            $count = $case->media()->where('type', 'image')->count();
            if ($count >= 5) {
                return response()->json(['success' => false, 'message' => 'Максимум 5 изображений'], 422);
            }
        } else {
            $allowed = ['video/mp4', 'video/webm'];
            if (!in_array($mime, $allowed)) {
                return response()->json(['success' => false, 'message' => 'Видео: только MP4, WebM'], 422);
            }
            if ($file->getSize() > 50 * 1024 * 1024) {
                return response()->json(['success' => false, 'message' => 'Видео до 50 MB'], 422);
            }
            $count = $case->media()->where('type', 'video')->count();
            if ($count >= 1) {
                return response()->json(['success' => false, 'message' => 'Максимум 1 видео'], 422);
            }
        }

        $dir = 'cases/' . $case->slug;
        $name = Str::random(12) . '.' . $ext;
        $path = $dir . '/' . $name;

        try {
            $full = $file->storeAs($dir, $name, 'public');
            if (!$full) {
                throw new \RuntimeException('storeAs returned false');
            }

            $maxOrder = $case->media()->max('order') ?? 0;
            $media = CaseMedia::create([
                'case_id' => $case->id,
                'type' => $type,
                'file_path' => $full,
                'order' => $maxOrder + 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Файл загружен',
                'data' => [
                    'id' => $media->id,
                    'type' => $media->type,
                    'file_path' => $media->file_path,
                    'url' => $media->url,
                    'order' => $media->order,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Case media upload error', [
                'case_id' => $caseId,
                'type' => $type,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Ошибка загрузки: ' . $e->getMessage(),
            ], 500);
        }
    }

    /** Удаление медиа */
    public function deleteCaseMedia(int $mediaId): JsonResponse
    {
        $media = CaseMedia::findOrFail($mediaId);

        try {
            if (Storage::disk('public')->exists($media->file_path)) {
                Storage::disk('public')->delete($media->file_path);
            }
            $media->delete();
            return response()->json(['success' => true, 'message' => 'Удалено']);
        } catch (\Throwable $e) {
            Log::error('Case media delete error', ['media_id' => $mediaId, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Ошибка удаления'], 500);
        }
    }

    /** Изменение порядка: body { order: [id1, id2, ...] } */
    public function reorderCaseMedia(Request $request, int $caseId): JsonResponse
    {
        $case = CaseModel::findOrFail($caseId);
        $order = $request->input('order');

        if (!is_array($order)) {
            return response()->json(['success' => false, 'message' => 'order — массив id'], 422);
        }

        $ids = $case->media()->pluck('id')->all();
        foreach ($order as $i => $id) {
            if (in_array((int) $id, $ids)) {
                CaseMedia::where('id', $id)->update(['order' => $i]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Порядок обновлён']);
    }
}
