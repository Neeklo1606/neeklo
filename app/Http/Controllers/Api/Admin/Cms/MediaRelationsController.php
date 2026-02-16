<?php

namespace App\Http\Controllers\Api\Admin\Cms;

use App\Actions\Media\AttachMediaToModelAction;
use App\Actions\Media\DetachMediaFromModelAction;
use App\Actions\Media\ReorderMediaCollectionAction;
use App\Actions\Media\UpdateMediaPivotMetaAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cms\Media\AttachMediaRequest;
use App\Http\Requests\Admin\Cms\Media\DetachMediaRequest;
use App\Http\Requests\Admin\Cms\Media\ReorderMediaRequest;
use App\Http\Requests\Admin\Cms\Media\UpdateMediaMetaRequest;
use App\Http\Resources\Admin\Cms\CaseStudyResource;
use App\Http\Resources\Admin\Cms\PageResource;
use App\Http\Resources\Admin\Cms\PostResource;
use App\Http\Resources\Admin\Cms\ServiceResource;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class MediaRelationsController extends Controller
{
    public function __construct(
        protected AttachMediaToModelAction $attachAction,
        protected DetachMediaFromModelAction $detachAction,
        protected ReorderMediaCollectionAction $reorderAction,
        protected UpdateMediaPivotMetaAction $updateMetaAction,
    ) {}

    public function attachToPage(AttachMediaRequest $request, Page $page): JsonResponse
    {
        $this->attachAction->handle(
            $page,
            $request->getMediaIds(),
            $request->validated('collection'),
            $request->validated('position'),
            $request->validated('meta', [])
        );
        $page->load(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function detachFromPage(DetachMediaRequest $request, Page $page): JsonResponse
    {
        $this->detachAction->handle($page, $request->validated('media_id'), $request->validated('collection'));
        $page->load(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function reorderPage(ReorderMediaRequest $request, Page $page): JsonResponse
    {
        $this->reorderAction->handle($page, $request->validated('collection'), $request->validated('order'));
        $page->load(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function updatePageMeta(UpdateMediaMetaRequest $request, Page $page): JsonResponse
    {
        $this->updateMetaAction->handle(
            $page,
            $request->validated('media_id'),
            $request->validated('collection'),
            $request->validated('meta')
        );
        $page->load(['blocks' => fn ($q) => $q->orderBy('position'), 'media']);
        return response()->json(['data' => new PageResource($page)]);
    }

    public function attachToService(AttachMediaRequest $request, Service $service): JsonResponse
    {
        $this->attachAction->handle(
            $service,
            $request->getMediaIds(),
            $request->validated('collection'),
            $request->validated('position'),
            $request->validated('meta', [])
        );
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function detachFromService(DetachMediaRequest $request, Service $service): JsonResponse
    {
        $this->detachAction->handle($service, $request->validated('media_id'), $request->validated('collection'));
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function reorderService(ReorderMediaRequest $request, Service $service): JsonResponse
    {
        $this->reorderAction->handle($service, $request->validated('collection'), $request->validated('order'));
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function updateServiceMeta(UpdateMediaMetaRequest $request, Service $service): JsonResponse
    {
        $this->updateMetaAction->handle(
            $service,
            $request->validated('media_id'),
            $request->validated('collection'),
            $request->validated('meta')
        );
        $service->load(['media', 'taxonomies']);
        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function attachToCaseStudy(AttachMediaRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        $this->attachAction->handle(
            $caseStudy,
            $request->getMediaIds(),
            $request->validated('collection'),
            $request->validated('position'),
            $request->validated('meta', [])
        );
        $caseStudy->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($caseStudy)]);
    }

    public function detachFromCaseStudy(DetachMediaRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        $this->detachAction->handle($caseStudy, $request->validated('media_id'), $request->validated('collection'));
        $caseStudy->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($caseStudy)]);
    }

    public function reorderCaseStudy(ReorderMediaRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        $this->reorderAction->handle($caseStudy, $request->validated('collection'), $request->validated('order'));
        $caseStudy->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($caseStudy)]);
    }

    public function updateCaseStudyMeta(UpdateMediaMetaRequest $request, CaseStudy $caseStudy): JsonResponse
    {
        $this->updateMetaAction->handle(
            $caseStudy,
            $request->validated('media_id'),
            $request->validated('collection'),
            $request->validated('meta')
        );
        $caseStudy->load(['media', 'taxonomies']);
        return response()->json(['data' => new CaseStudyResource($caseStudy)]);
    }

    public function attachToPost(AttachMediaRequest $request, Post $post): JsonResponse
    {
        $this->attachAction->handle(
            $post,
            $request->getMediaIds(),
            $request->validated('collection'),
            $request->validated('position'),
            $request->validated('meta', [])
        );
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }

    public function detachFromPost(DetachMediaRequest $request, Post $post): JsonResponse
    {
        $this->detachAction->handle($post, $request->validated('media_id'), $request->validated('collection'));
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }

    public function reorderPost(ReorderMediaRequest $request, Post $post): JsonResponse
    {
        $this->reorderAction->handle($post, $request->validated('collection'), $request->validated('order'));
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }

    public function updatePostMeta(UpdateMediaMetaRequest $request, Post $post): JsonResponse
    {
        $this->updateMetaAction->handle(
            $post,
            $request->validated('media_id'),
            $request->validated('collection'),
            $request->validated('meta')
        );
        $post->load(['media', 'taxonomies', 'author']);
        return response()->json(['data' => new PostResource($post)]);
    }
}
