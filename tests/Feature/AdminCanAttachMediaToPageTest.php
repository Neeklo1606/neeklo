<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanAttachMediaToPageTest extends TestCase
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

    public function test_admin_can_attach_media_to_page(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'attach-test',
            'title' => 'Attach Test',
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

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/pages/{$page->id}/media/attach", [
            'collection' => 'cover',
            'media_id' => $media->id,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.media_collections.cover.0.id', $media->id);

        $this->assertDatabaseHas('mediaables', [
            'media_id' => $media->id,
            'mediable_type' => Page::class,
            'mediable_id' => $page->id,
            'collection' => 'cover',
        ]);
    }
}
