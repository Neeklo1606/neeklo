<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Taxonomy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaxonomyMorphTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_can_attach_taxonomy_and_relation_returns_it(): void
    {
        $post = Post::create([
            'slug' => 'test-post',
            'title' => 'Test Post',
            'body' => 'Body text',
            'status' => 'draft',
        ]);

        $tag = Taxonomy::create([
            'type' => 'tag',
            'slug' => 'laravel',
            'title' => 'Laravel',
        ]);

        $post->taxonomies()->attach($tag->id);

        $post->load('taxonomies');

        $this->assertCount(1, $post->taxonomies);
        $this->assertSame('tag', $post->taxonomies->first()->type);
        $this->assertSame('laravel', $post->taxonomies->first()->slug);
    }
}
