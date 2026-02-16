<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanDetachMediaTest extends TestCase
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

    public function test_admin_can_detach_media(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'detach-test',
            'title' => 'Detach Test',
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

        $page->media()->attach($media->id, ['collection' => 'cover', 'position' => 0, 'meta' => []]);
        $this->assertDatabaseHas('mediaables', [
            'media_id' => $media->id,
            'mediable_id' => $page->id,
            'collection' => 'cover',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/pages/{$page->id}/media/detach", [
            'media_id' => $media->id,
            'collection' => 'cover',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('mediaables', [
            'media_id' => $media->id,
            'mediable_id' => $page->id,
            'collection' => 'cover',
        ]);
    }
}
