<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageBlock;
use App\Models\Post;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Taxonomy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CmsSeeder extends Seeder
{
    protected array $fixture = [];

    public function run(): void
    {
        $path = database_path('seeders/fixtures/frontend_content.json');
        if (!File::exists($path)) {
            $this->command->warn("Fixture not found: {$path}");
            return;
        }

        $this->fixture = json_decode(File::get($path), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('Invalid JSON in fixture');
            return;
        }

        $this->seedTaxonomies();
        $this->seedServices();
        $this->seedCaseStudies();
        $this->seedPosts();
        $this->seedPages();
        $this->seedMenus();
        $this->seedSettings();
        $this->attachTaxonomiesFromLinks();
    }

    protected function seedTaxonomies(): void
    {
        $items = $this->fixture['taxonomies'] ?? [];
        $taxByTypeSlug = [];
        foreach ($items as $t) {
            $parentId = null;
            if (!empty($t['parent_slug'])) {
                $parent = Taxonomy::where('slug', $t['parent_slug'])->first();
                $parentId = $parent?->id;
            }
            $tax = Taxonomy::updateOrCreate(
                ['type' => $t['type'], 'slug' => $t['slug']],
                [
                    'title' => $t['title'],
                    'description' => $t['description'] ?? null,
                    'parent_id' => $parentId,
                    'position' => $t['position'] ?? 0,
                ]
            );
            $taxByTypeSlug[$t['type'] . ':' . $t['slug']] = $tax;
        }
    }

    protected function seedServices(): void
    {
        $items = $this->fixture['services'] ?? [];
        foreach ($items as $s) {
            Service::updateOrCreate(
                ['slug' => $s['slug']],
                [
                    'title' => $s['title'],
                    'short' => $s['short'] ?? null,
                    'body' => $s['body'] ?? null,
                    'status' => $s['status'] ?? 'published',
                    'position' => $s['position'] ?? 0,
                    'price_from' => $s['price_from'] ?? null,
                    'seo_title' => $s['seo_title'] ?? null,
                    'seo_description' => $s['seo_description'] ?? null,
                ]
            );
        }
    }

    protected function seedCaseStudies(): void
    {
        $items = $this->fixture['case_studies'] ?? [];
        foreach ($items as $c) {
            CaseStudy::updateOrCreate(
                ['slug' => $c['slug']],
                [
                    'title' => $c['title'],
                    'client' => $c['client'] ?? null,
                    'industry' => $c['industry'] ?? null,
                    'problem' => $c['problem'] ?? null,
                    'solution' => $c['solution'] ?? null,
                    'result' => $c['result'] ?? null,
                    'body' => $c['body'] ?? null,
                    'status' => $c['status'] ?? 'published',
                    'published_at' => isset($c['published_at']) ? $c['published_at'] : null,
                    'seo_title' => $c['seo_title'] ?? null,
                    'seo_description' => $c['seo_description'] ?? null,
                ]
            );
        }
    }

    protected function seedPosts(): void
    {
        $items = $this->fixture['posts'] ?? [];
        foreach ($items as $p) {
            Post::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'title' => $p['title'],
                    'excerpt' => $p['excerpt'] ?? null,
                    'body' => $p['body'] ?? '',
                    'status' => $p['status'] ?? 'published',
                    'published_at' => isset($p['published_at']) ? $p['published_at'] : null,
                    'author_id' => null,
                    'seo_title' => $p['seo_title'] ?? null,
                    'seo_description' => $p['seo_description'] ?? null,
                ]
            );
        }
    }

    protected function seedPages(): void
    {
        $items = $this->fixture['pages'] ?? [];
        foreach ($items as $p) {
            $seo = $p['seo'] ?? [];
            $page = Page::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'title' => $p['title'],
                    'h1' => $p['title'],
                    'template' => $p['template'] ?? 'default',
                    'status' => $p['status'] ?? 'published',
                    'locale' => $p['locale'] ?? 'ru',
                    'seo_title' => $seo['seo_title'] ?? null,
                    'seo_description' => $seo['seo_description'] ?? null,
                    'og' => $seo['og'] ?? null,
                ]
            );

            PageBlock::where('page_id', $page->id)->delete();
            $blocks = $p['blocks'] ?? [];
            foreach ($blocks as $b) {
                PageBlock::create([
                    'page_id' => $page->id,
                    'type' => $b['type'],
                    'position' => $b['position'],
                    'is_enabled' => $b['is_enabled'] ?? true,
                    'data' => $b['data'] ?? [],
                ]);
            }
        }
    }

    protected function seedMenus(): void
    {
        $items = $this->fixture['menus'] ?? [];
        foreach ($items as $m) {
            $menu = Menu::updateOrCreate(
                ['key' => $m['key']],
                ['title' => $m['title']]
            );

            MenuItem::where('menu_id', $menu->id)->delete();
            $menuItems = $m['items'] ?? [];
            $this->seedMenuItems($menu, $menuItems, null);
        }
    }

    protected function seedMenuItems(Menu $menu, array $items, ?int $parentId, int $basePosition = 0): void
    {
        foreach ($items as $pos => $item) {
            $type = $item['type'] ?? 'url';
            $url = $item['url'] ?? null;
            $label = $item['label'] ?? '';

            $menuItem = MenuItem::create([
                'menu_id' => $menu->id,
                'parent_id' => $parentId,
                'type' => $type,
                'label' => $label,
                'url' => $url,
                'ref_id' => null,
                'position' => $basePosition + $pos,
                'is_enabled' => true,
                'meta' => [],
            ]);

            $children = $item['children'] ?? [];
            if (!empty($children)) {
                $this->seedMenuItems($menu, $children, $menuItem->id, 0);
            }
        }
    }

    protected function seedSettings(): void
    {
        $items = $this->fixture['settings'] ?? [];
        foreach ($items as $s) {
            Setting::updateOrCreate(
                ['group' => $s['group'], 'key' => $s['key']],
                ['value' => $s['value'] ?? []]
            );
        }
    }

    protected function attachTaxonomiesFromLinks(): void
    {
        $links = $this->fixture['links'] ?? [];
        $taxonomyIdsBySlug = Taxonomy::all()->groupBy('slug')->map(fn ($c) => $c->pluck('id')->values()->all());

        foreach ($links['case_studies'] ?? [] as $slug => $taxSlugs) {
            $caseStudy = CaseStudy::where('slug', $slug)->first();
            if (!$caseStudy) {
                continue;
            }
            $ids = collect($taxSlugs)->flatMap(fn ($s) => $taxonomyIdsBySlug->get($s, []))->unique()->values()->all();
            if (!empty($ids)) {
                $caseStudy->taxonomies()->sync($ids);
            }
        }

        foreach ($links['services'] ?? [] as $slug => $taxSlugs) {
            $service = Service::where('slug', $slug)->first();
            if (!$service) {
                continue;
            }
            $ids = collect($taxSlugs)->flatMap(fn ($s) => $taxonomyIdsBySlug->get($s, []))->unique()->values()->all();
            if (!empty($ids)) {
                $service->taxonomies()->sync($ids);
            }
        }

        foreach ($links['posts'] ?? [] as $slug => $taxSlugs) {
            $post = Post::where('slug', $slug)->first();
            if (!$post) {
                continue;
            }
            $ids = collect($taxSlugs)->flatMap(fn ($s) => $taxonomyIdsBySlug->get($s, []))->unique()->values()->all();
            if (!empty($ids)) {
                $post->taxonomies()->sync($ids);
            }
        }
    }
}
