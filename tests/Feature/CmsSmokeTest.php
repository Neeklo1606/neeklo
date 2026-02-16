<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use App\Models\Media;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsSmokeTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'slug' => 'admin']
        );
        $this->admin->roles()->sync([$role->id]);
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    protected function cms(string $method, string $uri, array $data = []): \Illuminate\Testing\TestResponse
    {
        return $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
            'Accept' => 'application/json',
        ])->{$method}($uri, $data);
    }

    protected function createMedia(array $overrides = []): Media
    {
        return Media::create(array_merge([
            'name' => 'cover.jpg',
            'original_name' => 'cover.jpg',
            'extension' => 'jpg',
            'disk' => 'uploads',
            'type' => 'photo',
            'size' => 1024,
        ], $overrides));
    }

    public function test_pages_full_scenario(): void
    {
        $base = '/api/admin/cms';

        // 1. Create page
        $createRes = $this->cms('postJson', "{$base}/pages", [
            'slug' => 'smoke-test-page-' . uniqid(),
            'title' => 'Smoke Test Page',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);
        $createRes->assertStatus(201);
        $pageId = $createRes->json('data.id');
        $this->assertDatabaseHas('pages', ['id' => $pageId, 'title' => 'Smoke Test Page']);

        // 2. Add 2 blocks
        $block1Res = $this->cms('postJson', "{$base}/pages/{$pageId}/blocks", [
            'type' => 'hero',
            'position' => 0,
            'is_enabled' => true,
            'data' => ['title' => 'Block 1'],
        ]);
        $block1Res->assertStatus(201);
        $block1Id = $block1Res->json('data.id');

        $block2Res = $this->cms('postJson', "{$base}/pages/{$pageId}/blocks", [
            'type' => 'text',
            'position' => 1,
            'is_enabled' => true,
            'data' => ['content' => 'Block 2 content'],
        ]);
        $block2Res->assertStatus(201);
        $block2Id = $block2Res->json('data.id');

        $this->assertDatabaseHas('page_blocks', ['id' => $block1Id, 'type' => 'hero']);
        $this->assertDatabaseHas('page_blocks', ['id' => $block2Id, 'type' => 'text']);

        // 3. Reorder blocks: block2 first, block1 second
        $reorderRes = $this->cms('postJson', "{$base}/pages/{$pageId}/blocks/reorder", [
            'block_ids' => [$block2Id, $block1Id],
        ]);
        $reorderRes->assertStatus(200)
            ->assertJsonPath('data.0.id', $block2Id)
            ->assertJsonPath('data.1.id', $block1Id);

        // 4. Create Media and attach cover
        $media = $this->createMedia(['name' => 'smoke-cover.jpg']);
        $attachRes = $this->cms('postJson', "{$base}/pages/{$pageId}/media/attach", [
            'collection' => 'cover',
            'media_id' => $media->id,
        ]);
        $attachRes->assertStatus(200)
            ->assertJsonPath('data.media_collections.cover.0.id', $media->id);
        $cover = $attachRes->json('data.media_collections.cover.0');
        $this->assertArrayHasKey('url', $cover);
        $this->assertNotEmpty($cover['url']);
        $this->assertIsString($cover['url']);

        $attachRes->assertJsonStructure([
            'data' => [
                'media_collections' => [
                    'cover' => [
                        '*' => ['id', 'url', 'thumb_url'],
                    ],
                ],
            ],
        ]);

        $this->assertDatabaseHas('mediaables', [
            'media_id' => $media->id,
            'mediable_type' => Page::class,
            'mediable_id' => $pageId,
            'collection' => 'cover',
        ]);

        // 5. Update meta alt
        $metaRes = $this->cms('putJson', "{$base}/pages/{$pageId}/media/meta", [
            'collection' => 'cover',
            'media_id' => $media->id,
            'meta' => ['alt' => 'Smoke test cover alt'],
        ]);
        $metaRes->assertStatus(200);

        $pivot = \DB::table('mediaables')
            ->where('media_id', $media->id)
            ->where('mediable_type', Page::class)
            ->where('mediable_id', $pageId)
            ->where('collection', 'cover')
            ->first();
        $this->assertNotNull($pivot);
        $decoded = json_decode($pivot->meta, true);
        $this->assertEquals('Smoke test cover alt', $decoded['alt'] ?? null);

        // 6. Detach cover
        $detachRes = $this->cms('postJson', "{$base}/pages/{$pageId}/media/detach", [
            'media_id' => $media->id,
            'collection' => 'cover',
        ]);
        $detachRes->assertStatus(200);
        $this->assertDatabaseMissing('mediaables', [
            'media_id' => $media->id,
            'mediable_id' => $pageId,
            'collection' => 'cover',
        ]);

        // 7. Delete block
        $deleteBlockRes = $this->cms('deleteJson', "{$base}/blocks/{$block2Id}");
        $deleteBlockRes->assertStatus(204);
        $this->assertDatabaseMissing('page_blocks', ['id' => $block2Id]);

        // 8. Delete page
        $deletePageRes = $this->cms('deleteJson', "{$base}/pages/{$pageId}");
        $deletePageRes->assertStatus(204);
        $this->assertSoftDeleted('pages', ['id' => $pageId]);
    }

    public function test_service_full_scenario(): void
    {
        $base = '/api/admin/cms';

        // 1. Create service
        $slug = 'smoke-service-' . uniqid();
        $createRes = $this->cms('postJson', "{$base}/services", [
            'slug' => $slug,
            'title' => 'Smoke Service',
            'status' => 'draft',
        ]);
        $createRes->assertStatus(201);
        $serviceId = $createRes->json('data.id');
        $this->assertDatabaseHas('services', ['id' => $serviceId]);

        // 2. Sync taxonomies
        $taxonomy = Taxonomy::create(['type' => 'tag', 'slug' => 'smoke-tag-' . uniqid(), 'title' => 'Smoke Tag']);
        $syncRes = $this->cms('postJson', "{$base}/services/{$serviceId}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);
        $syncRes->assertStatus(200);
        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => Service::class,
            'taxonomable_id' => $serviceId,
        ]);

        // 3. Attach cover
        $media = $this->createMedia();
        $attachRes = $this->cms('postJson', "{$base}/services/{$serviceId}/media/attach", [
            'collection' => 'cover',
            'media_id' => $media->id,
        ]);
        $attachRes->assertStatus(200)
            ->assertJsonStructure(['data' => ['media_collections' => ['cover' => [['id', 'url', 'thumb_url']]]]]);
        $this->assertDatabaseHas('mediaables', [
            'media_id' => $media->id,
            'mediable_type' => Service::class,
            'mediable_id' => $serviceId,
        ]);

        // 4. Delete service
        $deleteRes = $this->cms('deleteJson', "{$base}/services/{$serviceId}");
        $deleteRes->assertStatus(204);
        $this->assertSoftDeleted('services', ['id' => $serviceId]);
    }

    public function test_post_full_scenario(): void
    {
        $base = '/api/admin/cms';

        // 1. Create post
        $slug = 'smoke-post-' . uniqid();
        $createRes = $this->cms('postJson', "{$base}/posts", [
            'slug' => $slug,
            'title' => 'Smoke Post',
            'body' => 'Body text',
            'status' => 'draft',
        ]);
        $createRes->assertStatus(201);
        $postId = $createRes->json('data.id');
        $this->assertDatabaseHas('posts', ['id' => $postId]);

        // 2. Sync taxonomies
        $taxonomy = Taxonomy::create(['type' => 'category', 'slug' => 'smoke-cat-' . uniqid(), 'title' => 'Smoke Category']);
        $syncRes = $this->cms('postJson', "{$base}/posts/{$postId}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);
        $syncRes->assertStatus(200);
        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => Post::class,
            'taxonomable_id' => $postId,
        ]);

        // 3. Attach cover
        $media = $this->createMedia();
        $attachRes = $this->cms('postJson', "{$base}/posts/{$postId}/media/attach", [
            'collection' => 'cover',
            'media_id' => $media->id,
        ]);
        $attachRes->assertStatus(200)
            ->assertJsonStructure(['data' => ['media_collections' => ['cover' => [['id', 'url', 'thumb_url']]]]]);
        $this->assertDatabaseHas('mediaables', [
            'media_id' => $media->id,
            'mediable_type' => Post::class,
            'mediable_id' => $postId,
        ]);

        // 4. Delete post
        $deleteRes = $this->cms('deleteJson', "{$base}/posts/{$postId}");
        $deleteRes->assertStatus(204);
        $this->assertSoftDeleted('posts', ['id' => $postId]);
    }

    public function test_case_study_full_scenario(): void
    {
        $base = '/api/admin/cms';

        // 1. Create case study
        $slug = 'smoke-case-' . uniqid();
        $createRes = $this->cms('postJson', "{$base}/case-studies", [
            'slug' => $slug,
            'title' => 'Smoke Case Study',
            'status' => 'draft',
        ]);
        $createRes->assertStatus(201);
        $caseId = $createRes->json('data.id');
        $this->assertDatabaseHas('case_studies', ['id' => $caseId]);

        // 2. Sync taxonomies
        $taxonomy = Taxonomy::create(['type' => 'industry', 'slug' => 'smoke-ind-' . uniqid(), 'title' => 'Smoke Industry']);
        $syncRes = $this->cms('postJson', "{$base}/case-studies/{$caseId}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);
        $syncRes->assertStatus(200);
        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => CaseStudy::class,
            'taxonomable_id' => $caseId,
        ]);

        // 3. Attach cover and gallery
        $coverMedia = $this->createMedia(['name' => 'cover-case.jpg']);
        $attachCoverRes = $this->cms('postJson', "{$base}/case-studies/{$caseId}/media/attach", [
            'collection' => 'cover',
            'media_id' => $coverMedia->id,
        ]);
        $attachCoverRes->assertStatus(200)
            ->assertJsonStructure(['data' => ['media_collections' => ['cover' => [['id', 'url', 'thumb_url']]]]]);

        $galleryMedia1 = $this->createMedia(['name' => 'gallery1.jpg']);
        $galleryMedia2 = $this->createMedia(['name' => 'gallery2.jpg']);
        $attachGalleryRes = $this->cms('postJson', "{$base}/case-studies/{$caseId}/media/attach", [
            'collection' => 'gallery',
            'media_ids' => [$galleryMedia1->id, $galleryMedia2->id],
        ]);
        $attachGalleryRes->assertStatus(200);

        $this->assertDatabaseHas('mediaables', [
            'media_id' => $coverMedia->id,
            'mediable_type' => CaseStudy::class,
            'mediable_id' => $caseId,
            'collection' => 'cover',
        ]);
        $this->assertDatabaseHas('mediaables', [
            'media_id' => $galleryMedia1->id,
            'mediable_type' => CaseStudy::class,
            'mediable_id' => $caseId,
            'collection' => 'gallery',
        ]);
        $this->assertDatabaseHas('mediaables', [
            'media_id' => $galleryMedia2->id,
            'mediable_type' => CaseStudy::class,
            'mediable_id' => $caseId,
            'collection' => 'gallery',
        ]);

        $cover = $attachCoverRes->json('data.media_collections.cover.0');
        $this->assertArrayHasKey('url', $cover);
        $this->assertNotEmpty($cover['url']);

        // 4. Delete case study
        $deleteRes = $this->cms('deleteJson', "{$base}/case-studies/{$caseId}");
        $deleteRes->assertStatus(204);
        $this->assertSoftDeleted('case_studies', ['id' => $caseId]);
    }
}
