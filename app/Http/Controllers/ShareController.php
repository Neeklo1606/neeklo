<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\Setting;
use App\Support\CmsCacheInvalidator;
use App\Support\PublicUrlResolver;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ShareController extends Controller
{
    public function page(string $slug): Response
    {
        return $this->share('page', $slug, function () use ($slug) {
            return Page::query()
                ->where('slug', $slug)
                ->where('status', 'published')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->with('media')
                ->first();
        }, fn ($entity) => [
            'title' => $entity->seo_title ?: $entity->title,
            'description' => $entity->seo_description ?: $this->defaultDescription(),
            'og_image' => $this->ogImageFromEntity($entity),
            'og' => $entity->og ?? [],
        ], fn ($entity) => app(PublicUrlResolver::class)->page($entity));
    }

    public function service(string $slug): Response
    {
        return $this->share('service', $slug, function () use ($slug) {
            return Service::query()
                ->where('slug', $slug)
                ->where('status', 'published')
                ->with('media')
                ->first();
        }, fn ($entity) => [
            'title' => $entity->seo_title ?: $entity->title,
            'description' => $entity->seo_description ?: $this->defaultDescription(),
            'og_image' => $this->ogImageFromEntity($entity),
            'og' => is_array($entity->og ?? null) ? $entity->og : [],
        ], fn ($entity) => app(PublicUrlResolver::class)->service($entity));
    }

    public function post(string $slug): Response
    {
        return $this->share('post', $slug, function () use ($slug) {
            return Post::query()
                ->where('slug', $slug)
                ->where('status', 'published')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->with('media')
                ->first();
        }, fn ($entity) => [
            'title' => $entity->seo_title ?: $entity->title,
            'description' => $entity->seo_description ?: ($entity->excerpt ?: $this->defaultDescription()),
            'og_image' => $this->ogImageFromEntity($entity),
            'og' => is_array($entity->og ?? null) ? $entity->og : [],
        ], fn ($entity) => app(PublicUrlResolver::class)->post($entity));
    }

    public function caseStudy(string $slug): Response
    {
        return $this->share('case-study', $slug, function () use ($slug) {
            return CaseStudy::query()
                ->where('slug', $slug)
                ->where('status', 'published')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->with('media')
                ->first();
        }, fn ($entity) => [
            'title' => $entity->seo_title ?: $entity->title,
            'description' => $entity->seo_description ?: $this->defaultDescription(),
            'og_image' => $this->ogImageFromEntity($entity),
            'og' => is_array($entity->og ?? null) ? $entity->og : [],
        ], fn ($entity) => app(PublicUrlResolver::class)->caseStudy($entity));
    }

    /**
     * @param callable $loadEntity
     * @param callable $buildMeta (entity) => [title, description, og_image, og]
     * @param callable $targetPath (entity) => string|null path for redirect
     */
    protected function share(string $type, string $slug, callable $loadEntity, callable $buildMeta, callable $targetPath): Response
    {
        $invalidator = app(CmsCacheInvalidator::class);
        $key = $invalidator->shareKey($type, $slug);

        $html = Cache::remember($key, 3600, function () use ($loadEntity, $buildMeta, $targetPath) {
            $entity = $loadEntity();
            if (! $entity) {
                return null;
            }
            $targetPathStr = $targetPath($entity);
            if ($targetPathStr === null) {
                return null;
            }
            $resolver = app(PublicUrlResolver::class);
            $targetUrl = $resolver->absolute($targetPathStr);
            $meta = $buildMeta($entity);
            $og = $meta['og'];
            $ogUrl = ($og['url'] ?? null) ?: $targetUrl;
            return view('share', [
                'title' => $meta['title'],
                'description' => $meta['description'],
                'ogImage' => $meta['og_image'] ?: ($og['image'] ?? ''),
                'ogUrl' => $ogUrl,
                'targetUrl' => $targetUrl,
            ])->render();
        });

        if ($html === null) {
            abort(404);
        }

        return response($html, 200, [
            'Content-Type' => 'text/html; charset=utf-8',
        ]);
    }

    protected function defaultDescription(): string
    {
        $s = Setting::where('group', 'seo')->where('key', 'default_description')->first();
        $v = $s?->value;
        return is_array($v) && isset($v[0]) ? (string) $v[0] : '';
    }

    /**
     * @param Page|Service|Post|CaseStudy $entity
     */
    protected function ogImageFromEntity($entity): string
    {
        if (! $entity->relationLoaded('media')) {
            $entity->load('media');
        }
        $cover = $entity->media->first(fn ($m) => ($m->pivot->collection ?? null) === 'cover');
        if (! $cover) {
            return '';
        }
        $metadata = $cover->metadata ? json_decode($cover->metadata, true) : [];
        $path = $metadata['path'] ?? ($cover->disk . '/' . $cover->name);
        $disk = $cover->disk;
        if (config("filesystems.disks.{$disk}")) {
            return Storage::disk($disk)->url($path);
        }
        return url('/' . ltrim($path, '/'));
    }
}
