<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCaseStudiesIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_case_studies_index_returns_only_published(): void
    {
        CaseStudy::create([
            'slug' => 'published-one',
            'title' => 'Published Case',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
        CaseStudy::create([
            'slug' => 'draft-one',
            'title' => 'Draft Case',
            'status' => 'draft',
        ]);
        CaseStudy::create([
            'slug' => 'archived-one',
            'title' => 'Archived Case',
            'status' => 'archived',
        ]);

        $response = $this->getJson('/api/v1/public/case-studies');

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

    public function test_case_studies_show_returns_published_by_slug(): void
    {
        CaseStudy::create([
            'slug' => 'web-project',
            'title' => 'Web Project',
            'body' => 'Project description.',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/v1/public/case-studies/web-project');

        $response->assertStatus(200);
        $response->assertJsonPath('data.slug', 'web-project');
        $response->assertJsonPath('data.title', 'Web Project');
    }

    public function test_case_studies_show_returns_404_for_draft(): void
    {
        CaseStudy::create([
            'slug' => 'draft-case',
            'title' => 'Draft',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/v1/public/case-studies/draft-case');

        $response->assertStatus(404);
    }

    public function test_case_studies_index_excludes_future_published_at(): void
    {
        CaseStudy::create([
            'slug' => 'future-case',
            'title' => 'Future Case',
            'status' => 'published',
            'published_at' => now()->addDay(),
        ]);

        $response = $this->getJson('/api/v1/public/case-studies');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }
}
