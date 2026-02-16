<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class CmsCacheInvalidator
{
    protected string $locale = 'ru';

    public function bootstrapKey(): string
    {
        return "public.bootstrap.{$this->locale}";
    }

    public function pageKey(string $slug): string
    {
        return "public.page.{$slug}.{$this->locale}";
    }

    public function forgetBootstrap(): void
    {
        Cache::forget($this->bootstrapKey());
    }

    public function forgetPage(string $slug): void
    {
        Cache::forget($this->pageKey($slug));
    }

    public function forgetPages(array $slugs): void
    {
        $slugs = array_unique($slugs);
        foreach ($slugs as $slug) {
            $this->forgetPage($slug);
        }
    }

    public function sitemapKey(): string
    {
        return 'public.sitemap';
    }

    public function forgetSitemap(): void
    {
        Cache::forget($this->sitemapKey());
    }

    public function shareKey(string $type, string $slug): string
    {
        return "public.share.{$type}.{$slug}";
    }

    public function forgetShare(string $type, string $slug): void
    {
        Cache::forget($this->shareKey($type, $slug));
    }
}
