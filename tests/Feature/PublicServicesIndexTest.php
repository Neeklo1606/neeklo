<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicServicesIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_services_index_returns_only_published(): void
    {
        Service::create([
            'slug' => 'published-one',
            'title' => 'Published Service',
            'status' => 'published',
            'position' => 0,
        ]);
        Service::create([
            'slug' => 'draft-one',
            'title' => 'Draft Service',
            'status' => 'draft',
            'position' => 1,
        ]);
        Service::create([
            'slug' => 'archived-one',
            'title' => 'Archived Service',
            'status' => 'archived',
            'position' => 2,
        ]);

        $response = $this->getJson('/api/v1/public/services');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('published-one', $data[0]['slug']);
    }

    public function test_services_show_returns_published_by_slug(): void
    {
        Service::create([
            'slug' => 'web-dev',
            'title' => 'Web Development',
            'status' => 'published',
            'body' => 'We build websites.',
        ]);

        $response = $this->getJson('/api/v1/public/services/web-dev');

        $response->assertStatus(200);
        $response->assertJsonPath('data.slug', 'web-dev');
        $response->assertJsonPath('data.title', 'Web Development');
    }

    public function test_services_show_returns_404_for_draft(): void
    {
        Service::create([
            'slug' => 'draft-service',
            'title' => 'Draft',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/v1/public/services/draft-service');

        $response->assertStatus(404);
    }
}
