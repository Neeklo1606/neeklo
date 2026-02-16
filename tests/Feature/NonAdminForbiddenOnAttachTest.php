<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NonAdminForbiddenOnAttachTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_forbidden_on_attach(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'forbidden-test',
            'title' => 'Forbidden Test',
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

        $response->assertStatus(403);
    }
}
