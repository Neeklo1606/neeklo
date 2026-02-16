<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SharePagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_share_page_returns_200_and_contains_og_title_and_refresh_url(): void
    {
        Page::create([
            'slug' => 'home',
            'title' => 'Home',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
            'seo_title' => 'SEO Home',
        ]);

        $response = $this->get('/share/page/home');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/html; charset=utf-8');
        $body = $response->getContent();
        $this->assertStringContainsString('og:title', $body);
        $this->assertStringContainsString('SEO Home', $body);
        $this->assertStringContainsString('http-equiv="refresh"', $body);
        $this->assertStringContainsString('url=', $body);
    }

    public function test_share_page_404_for_draft(): void
    {
        Page::create([
            'slug' => 'draft-page',
            'title' => 'Draft',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $response = $this->get('/share/page/draft-page');

        $response->assertStatus(404);
    }

    public function test_share_service_returns_404_if_slug_not_in_product_slugs(): void
    {
        Service::create([
            'slug' => 'unknown-product',
            'title' => 'Unknown',
            'status' => 'published',
            'position' => 0,
        ]);

        $response = $this->get('/share/service/unknown-product');

        $response->assertStatus(404);
    }

    public function test_share_service_returns_200_for_known_product_slug(): void
    {
        Service::create([
            'slug' => 'website',
            'title' => 'Website',
            'status' => 'published',
            'position' => 0,
        ]);

        $response = $this->get('/share/service/website');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/html; charset=utf-8');
        $this->assertStringContainsString('og:title', $response->getContent());
    }

    public function test_share_post_returns_200(): void
    {
        Post::create([
            'slug' => 'my-post',
            'title' => 'My Post',
            'body' => 'Body',
            'status' => 'published',
        ]);

        $response = $this->get('/share/post/my-post');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/html; charset=utf-8');
        $body = $response->getContent();
        $this->assertStringContainsString('og:title', $body);
        $this->assertStringContainsString('My Post', $body);
    }

    public function test_share_case_study_returns_200(): void
    {
        CaseStudy::create([
            'slug' => 'my-case',
            'title' => 'My Case',
            'status' => 'published',
        ]);

        $response = $this->get('/share/case-study/my-case');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/html; charset=utf-8');
        $body = $response->getContent();
        $this->assertStringContainsString('og:title', $body);
        $this->assertStringContainsString('My Case', $body);
    }
}
