<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanReorderGalleryTest extends TestCase
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

    public function test_admin_can_reorder_gallery(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'reorder-test',
            'title' => 'Reorder Test',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $m1 = Media::create(['name' => 'a.jpg', 'original_name' => 'a.jpg', 'extension' => 'jpg', 'disk' => 'uploads', 'type' => 'photo', 'size' => 100]);
        $m2 = Media::create(['name' => 'b.jpg', 'original_name' => 'b.jpg', 'extension' => 'jpg', 'disk' => 'uploads', 'type' => 'photo', 'size' => 100]);
        $m3 = Media::create(['name' => 'c.jpg', 'original_name' => 'c.jpg', 'extension' => 'jpg', 'disk' => 'uploads', 'type' => 'photo', 'size' => 100]);

        $page->media()->attach($m1->id, ['collection' => 'gallery', 'position' => 0, 'meta' => []]);
        $page->media()->attach($m2->id, ['collection' => 'gallery', 'position' => 1, 'meta' => []]);
        $page->media()->attach($m3->id, ['collection' => 'gallery', 'position' => 2, 'meta' => []]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/pages/{$page->id}/media/reorder", [
            'collection' => 'gallery',
            'order' => [$m3->id, $m1->id, $m2->id],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.media_collections.gallery.0.id', $m3->id)
            ->assertJsonPath('data.media_collections.gallery.1.id', $m1->id)
            ->assertJsonPath('data.media_collections.gallery.2.id', $m2->id);

        $positions = \DB::table('mediaables')
            ->where('mediable_type', Page::class)
            ->where('mediable_id', $page->id)
            ->where('collection', 'gallery')
            ->orderBy('position')
            ->pluck('media_id', 'position')
            ->all();
        $this->assertEquals([0 => $m3->id, 1 => $m1->id, 2 => $m2->id], $positions);
    }
}
