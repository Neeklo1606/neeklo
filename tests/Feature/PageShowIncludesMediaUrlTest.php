<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageShowIncludesMediaUrlTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdminUser(): User
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'slug' => 'admin']
        );
        $user->roles()->sync([$role->id]);
        return $user;
    }

    public function test_page_show_includes_media_collections_cover_with_url(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'page-with-cover',
            'title' => 'Page With Cover',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $media = Media::create([
            'name' => 'cover.jpg',
            'original_name' => 'cover.jpg',
            'extension' => 'jpg',
            'disk' => 'uploads',
            'type' => 'photo',
            'size' => 1024,
        ]);

        $page->media()->attach($media->id, [
            'collection' => 'cover',
            'position' => 0,
            'meta' => null,
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson("/api/admin/cms/pages/{$page->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.media_collections.cover.0.id', $media->id);

        $cover = $response->json('data.media_collections.cover.0');
        $this->assertNotEmpty($cover['url']);
        $this->assertIsString($cover['url']);
    }
}
