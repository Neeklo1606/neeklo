<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SitemapRoutesSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_urls_return_200_or_redirect_not_404(): void
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

        $xml = $response->getContent();
        $locs = [];
        if (preg_match_all('#<loc>([^<]+)</loc>#', $xml, $m)) {
            $locs = $m[1];
        }
        $this->assertNotEmpty($locs, 'Sitemap should contain at least one <loc>');

        $toCheck = array_slice($locs, 0, 10);
        foreach ($toCheck as $absoluteUrl) {
            $path = parse_url($absoluteUrl, PHP_URL_PATH);
            if ($path === false || $path === '') {
                $path = '/';
            } else {
                $path = '/' . ltrim($path, '/');
            }
            $r = $this->get($path);
            $status = $r->getStatusCode();
            $this->assertContains($status, [200, 301, 302], "URL {$path} (from {$absoluteUrl}) should return 200/301/302, got {$status}");
        }
    }
}
