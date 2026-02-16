<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\PageBlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageBlocksRelationTest extends TestCase
{
    use RefreshDatabase;

    public function test_blocks_are_ordered_by_position(): void
    {
        $page = Page::create([
            'slug' => 'test-page',
            'title' => 'Test Page',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        PageBlock::create(['page_id' => $page->id, 'type' => 'hero', 'position' => 2, 'data' => []]);
        PageBlock::create(['page_id' => $page->id, 'type' => 'features', 'position' => 0, 'data' => []]);
        PageBlock::create(['page_id' => $page->id, 'type' => 'cta', 'position' => 1, 'data' => []]);

        $page->load('blocks');
        $blocks = $page->blocks;

        $this->assertCount(3, $blocks);
        $this->assertSame('features', $blocks[0]->type);
        $this->assertSame('cta', $blocks[1]->type);
        $this->assertSame('hero', $blocks[2]->type);
    }
}
