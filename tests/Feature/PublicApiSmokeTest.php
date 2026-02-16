<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiSmokeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Smoke: home page returns 200 and blocks is not empty.
     */
    public function test_home_page_returns_200_and_blocks_not_empty(): void
    {
        $page = Page::create([
            'slug' => 'home',
            'title' => 'Главная',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ]);

        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 0,
            'is_enabled' => true,
            'data' => ['title' => 'Hero'],
        ]);

        $response = $this->getJson('/api/v1/public/pages/home');

        $response->assertStatus(200);
        $blocks = $response->json('data.blocks');
        $this->assertIsArray($blocks);
        $this->assertNotEmpty($blocks, 'Home page blocks must not be empty');
    }
}
