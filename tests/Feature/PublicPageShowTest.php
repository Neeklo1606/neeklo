<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PublicPageShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_show_returns_published_page_with_blocks_ordered_and_seo(): void
    {
        $page = Page::create([
            'slug' => 'test-home',
            'title' => 'Test Home',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
            'seo_title' => 'SEO Title',
            'seo_description' => 'SEO Description',
            'og' => ['image' => 'https://example.com/og.png'],
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 1,
            'is_enabled' => true,
            'data' => ['title' => 'Hero'],
        ]);
        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'contact_form',
            'position' => 0,
            'is_enabled' => true,
            'data' => ['title' => 'Contact'],
        ]);

        $response = $this->getJson('/api/v1/public/pages/test-home');

        $response->assertStatus(200);
        $response->assertJsonPath('data.slug', 'test-home');
        $response->assertJsonPath('data.seo_title', 'SEO Title');
        $response->assertJsonPath('data.seo_description', 'SEO Description');
        $response->assertJsonPath('data.og', ['image' => 'https://example.com/og.png']);

        $blocks = $response->json('data.blocks');
        $this->assertCount(2, $blocks);
        $this->assertEquals('contact_form', $blocks[0]['type']);
        $this->assertEquals('hero', $blocks[1]['type']);
    }

    public function test_page_show_returns_404_for_draft_page(): void
    {
        Page::create([
            'slug' => 'draft-page',
            'title' => 'Draft',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $response = $this->getJson('/api/v1/public/pages/draft-page');

        $response->assertStatus(404);
    }

    public function test_page_show_returns_404_for_nonexistent_slug(): void
    {
        $response = $this->getJson('/api/v1/public/pages/nonexistent');

        $response->assertStatus(404);
    }

    public function test_page_show_excludes_disabled_blocks(): void
    {
        $page = Page::create([
            'slug' => 'with-disabled',
            'title' => 'With Disabled',
            'status' => 'published',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 0,
            'is_enabled' => true,
            'data' => [],
        ]);
        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'hidden_block',
            'position' => 1,
            'is_enabled' => false,
            'data' => [],
        ]);

        $response = $this->getJson('/api/v1/public/pages/with-disabled');

        $response->assertStatus(200);
        $blocks = $response->json('data.blocks');
        $this->assertCount(1, $blocks);
        $this->assertEquals('hero', $blocks[0]['type']);
    }
}
