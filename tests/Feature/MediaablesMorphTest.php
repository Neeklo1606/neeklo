<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaablesMorphTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_can_attach_media_with_meta_and_pivot_exists(): void
    {
        $media = Media::create([
            'name' => 'test.jpg',
            'original_name' => 'test.jpg',
            'extension' => 'jpg',
            'disk' => 'uploads',
            'type' => 'photo',
            'size' => 1024,
        ]);

        $page = Page::create([
            'slug' => 'test-page',
            'title' => 'Test Page',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $page->media()->attach($media->id, [
            'collection' => 'cover',
            'position' => 0,
            'meta' => ['alt' => 'Cover image'],
        ]);

        $page->load('media');

        $this->assertCount(1, $page->media);
        $this->assertSame('cover', $page->media->first()->pivot->collection);
        $this->assertSame(0, $page->media->first()->pivot->position);
        $this->assertIsArray($page->media->first()->pivot->meta);
        $this->assertSame('Cover image', $page->media->first()->pivot->meta['alt'] ?? null);
    }
}
