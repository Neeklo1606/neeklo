<?php

namespace App\Support;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;

class PublicUrlResolver
{
    /**
     * CMS page slug -> public path (without leading slash for root).
     * Must match frontend App.tsx routes.
     */
    protected function pageSlugToPath(): array
    {
        return [
            'home' => '/',
            'services' => '/services',
            'blog' => '/blog',
            'case-studies' => '/cases',
            'contact' => '/contact',
            'work' => '/work',
        ];
    }

    /**
     * Service slugs that have a real SPA route under /products/{slug}.
     * Must match frontend App.tsx Route paths.
     */
    protected function knownProductSlugs(): array
    {
        return config('cms.product_slugs', [
            'website', 'telegram-bot', 'ai-video', 'ai-agent', 'mini-app',
            'automation', 'ecosystem', 'branding', 'crm', 'mobile-app',
            'support', 'consulting',
        ]);
    }

    public function page(Page $page): string
    {
        $map = $this->pageSlugToPath();
        $path = $map[$page->slug] ?? '/' . $page->slug;
        return $path === '/' ? '/' : rtrim($path, '/');
    }

    /**
     * Service detail URL. Returns null if SPA has no route for this slug.
     */
    public function service(Service $service): ?string
    {
        if (! in_array($service->slug, $this->knownProductSlugs(), true)) {
            return null;
        }
        return '/products/' . $service->slug;
    }

    /**
     * Post detail URL. SPA has /blog/:slug.
     */
    public function post(Post $post): ?string
    {
        return '/blog/' . $post->slug;
    }

    /**
     * Case study detail URL. SPA has /work/:slug (WorkDetail).
     */
    public function caseStudy(CaseStudy $caseStudy): ?string
    {
        return '/work/' . $caseStudy->slug;
    }

    public function absolute(string $path): string
    {
        $path = '/' . ltrim($path, '/');
        $base = rtrim(config('app.url'), '/');
        return $base . $path;
    }
}
