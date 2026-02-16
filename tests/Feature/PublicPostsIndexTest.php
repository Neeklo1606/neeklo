<?php

namespace Tests\Feature;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPostsIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_posts_index_returns_only_published(): void
    {
        Post::create([
            'slug' => 'published-one',
            'title' => 'Published Post',
            'body' => 'Body',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
        Post::create([
            'slug' => 'draft-one',
            'title' => 'Draft Post',
            'body' => 'Body',
            'status' => 'draft',
        ]);
        Post::create([
            'slug' => 'archived-one',
            'title' => 'Archived Post',
            'body' => 'Body',
            'status' => 'archived',
        ]);

        $response = $this->getJson('/api/v1/public/posts');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('published-one', $data[0]['slug']);
        $response->assertJsonStructure([
            'data',
            'meta' => [
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
            ],
        ]);
    }

    public function test_posts_show_returns_published_by_slug(): void
    {
        Post::create([
            'slug' => 'my-article',
            'title' => 'My Article',
            'body' => 'Article content.',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/v1/public/posts/my-article');

        $response->assertStatus(200);
        $response->assertJsonPath('data.slug', 'my-article');
        $response->assertJsonPath('data.title', 'My Article');
    }

    public function test_posts_show_returns_404_for_draft(): void
    {
        Post::create([
            'slug' => 'draft-post',
            'title' => 'Draft',
            'body' => 'Body',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/v1/public/posts/draft-post');

        $response->assertStatus(404);
    }

    public function test_posts_index_excludes_future_published_at(): void
    {
        Post::create([
            'slug' => 'future-post',
            'title' => 'Future Post',
            'body' => 'Body',
            'status' => 'published',
            'published_at' => now()->addDay(),
        ]);

        $response = $this->getJson('/api/v1/public/posts');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }
}
