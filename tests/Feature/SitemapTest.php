<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_returns_200_and_xml(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $this->assertStringContainsString('<urlset', $response->getContent());
    }

    public function test_sitemap_contains_home_and_services_when_published(): void
    {
        Page::create([
            'slug' => 'home',
            'title' => 'Home',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ]);
        Page::create([
            'slug' => 'services',
            'title' => 'Services',
            'status' => 'published',
            'template' => 'default',
            'locale' => 'ru',
        ]);
        Service::create([
            'slug' => 'website',
            'title' => 'Website',
            'status' => 'published',
            'position' => 0,
        ]);

        Cache::forget(app(\App\Support\CmsCacheInvalidator::class)->sitemapKey());
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $body = $response->getContent();
        $this->assertStringContainsString('<urlset', $body);
        $base = rtrim(config('app.url'), '/');
        $this->assertStringContainsString('<loc>' . $base . '/</loc>', $body);
        $this->assertStringContainsString('<loc>' . $base . '/services</loc>', $body);
        $this->assertStringContainsString('<loc>' . $base . '/products/website</loc>', $body);
    }

    public function test_sitemap_excludes_draft_pages_and_services(): void
    {
        Page::create([
            'slug' => 'home',
            'title' => 'Home',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ]);
        Page::create([
            'slug' => 'secret',
            'title' => 'Secret',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);
        Service::create([
            'slug' => 'draft-service',
            'title' => 'Draft',
            'status' => 'draft',
            'position' => 0,
        ]);

        Cache::forget(app(\App\Support\CmsCacheInvalidator::class)->sitemapKey());
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $body = $response->getContent();
        $this->assertStringNotContainsString('/secret</loc>', $body);
        $this->assertStringNotContainsString('/products/draft-service</loc>', $body);
    }

    public function test_sitemap_invalidated_on_page_update(): void
    {
        Page::create([
            'slug' => 'home',
            'title' => 'Home',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ]);

        $this->get('/sitemap.xml');
        $this->assertNotNull(Cache::get(app(\App\Support\CmsCacheInvalidator::class)->sitemapKey()));

        $page = Page::where('slug', 'home')->first();
        $page->update(['title' => 'Updated']);

        $this->assertNull(Cache::get(app(\App\Support\CmsCacheInvalidator::class)->sitemapKey()));
    }
}
