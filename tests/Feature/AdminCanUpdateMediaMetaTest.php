<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanUpdateMediaMetaTest extends TestCase
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

    public function test_admin_can_update_media_meta(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'meta-test',
            'title' => 'Meta Test',
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

        $page->media()->attach($media->id, ['collection' => 'cover', 'position' => 0, 'meta' => ['alt' => 'original']]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson("/api/admin/cms/pages/{$page->id}/media/meta", [
            'collection' => 'cover',
            'media_id' => $media->id,
            'meta' => ['alt' => 'updated caption'],
        ]);

        $response->assertStatus(200);

        $pivot = \DB::table('mediaables')
            ->where('media_id', $media->id)
            ->where('mediable_type', Page::class)
            ->where('mediable_id', $page->id)
            ->where('collection', 'cover')
            ->first();
        $this->assertNotNull($pivot);
        $decoded = json_decode($pivot->meta, true);
        $this->assertEquals('updated caption', $decoded['alt'] ?? null);
    }
}
