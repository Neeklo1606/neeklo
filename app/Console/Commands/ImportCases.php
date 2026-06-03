<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\Taxonomy;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportCases extends Command
{
    protected $signature = 'cases:import {file : Path to JSON file with cases} {--dry-run : Validate without writing to DB} {--force : Update existing slugs}';
    protected $description = 'Import cases from a JSON file into case_studies table';

    public function handle(): int
    {
        $path = $this->argument('file');
        $dryRun = $this->option('dry-run');
        $force = $this->option('force');

        if (!file_exists($path)) {
            $this->error("File not found: {$path}");
            return 1;
        }

        $raw = file_get_contents($path);
        $json = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Invalid JSON: ' . json_last_error_msg());
            return 1;
        }

        // Support both root array and { cases: [...] }
        $items = isset($json['cases']) ? $json['cases'] : (array_is_list($json) ? $json : [$json]);

        $this->info("Found " . count($items) . " case(s) in file.");

        if ($dryRun) {
            $this->warn('DRY RUN — nothing will be written.');
        }

        $created = 0;
        $updated = 0;
        $skipped = 0;

        DB::beginTransaction();

        try {
            foreach ($items as $i => $item) {
                $n = $i + 1;

                $title = trim($item['title'] ?? '');
                if (!$title) {
                    $this->warn("  [{$n}] Skipped: no title.");
                    $skipped++;
                    continue;
                }

                $slug = trim($item['slug'] ?? Str::slug($title));
                if (!$slug) {
                    $this->warn("  [{$n}] Skipped: could not generate slug for '{$title}'.");
                    $skipped++;
                    continue;
                }

                $existing = CaseStudy::where('slug', $slug)->withTrashed()->first();

                if ($existing && !$force) {
                    $this->warn("  [{$n}] Skipped (slug exists): {$slug}. Use --force to update.");
                    $skipped++;
                    continue;
                }

                $status = $item['status'] ?? 'published';
                if (!in_array($status, ['draft', 'published', 'archived'])) {
                    $status = 'published';
                }

                $publishedAt = null;
                if (!empty($item['published_at'])) {
                    try {
                        $publishedAt = \Carbon\Carbon::parse($item['published_at']);
                    } catch (\Exception $e) {
                        $publishedAt = now();
                    }
                } elseif ($status === 'published') {
                    $publishedAt = now();
                }

                $attrs = [
                    'title'             => $title,
                    'client'            => $item['client'] ?? null,
                    'industry'          => $item['industry'] ?? null,
                    'short_description' => $item['short_description'] ?? $item['shortDescription'] ?? null,
                    'problem'           => $item['problem'] ?? null,
                    'solution'          => $item['solution'] ?? null,
                    'result'            => $item['result'] ?? null,
                    'body'              => $item['body'] ?? $item['content'] ?? null,
                    'video_url'         => $item['video_url'] ?? $item['videoUrl'] ?? null,
                    'status'            => $status,
                    'published_at'      => $publishedAt,
                    'seo_title'         => $item['seo_title'] ?? $item['seoTitle'] ?? null,
                    'seo_description'   => $item['seo_description'] ?? $item['seoDescription'] ?? null,
                ];

                if (!$dryRun) {
                    if ($existing) {
                        if ($existing->trashed()) {
                            $existing->restore();
                        }
                        $existing->update($attrs);
                        $case = $existing;
                        $updated++;
                        $this->line("  [{$n}] Updated: {$slug}");
                    } else {
                        $case = CaseStudy::create(array_merge(['slug' => $slug], $attrs));
                        $created++;
                        $this->line("  [{$n}] Created: {$slug}");
                    }

                    // Sync taxonomies (tags/categories)
                    $tags = $item['tags'] ?? $item['taxonomies'] ?? $item['categories'] ?? [];
                    if (!empty($tags)) {
                        $taxonomyIds = [];
                        foreach ($tags as $tag) {
                            $tagTitle = is_array($tag) ? ($tag['title'] ?? '') : (string) $tag;
                            if (!$tagTitle) continue;
                            $taxonomy = Taxonomy::firstOrCreate(
                                ['slug' => Str::slug($tagTitle)],
                                ['title' => $tagTitle, 'type' => 'tag']
                            );
                            $taxonomyIds[] = $taxonomy->id;
                        }
                        $case->taxonomies()->sync($taxonomyIds);
                    }
                } else {
                    $action = $existing ? 'Would update' : 'Would create';
                    $this->line("  [{$n}] {$action}: {$slug}");
                    $created++;
                }
            }

            if (!$dryRun) {
                DB::commit();
                $this->newLine();
                $this->info("Done. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
            } else {
                DB::rollBack();
                $this->newLine();
                $this->info("Dry run complete. Would process: {$created}, Skip: {$skipped}.");
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Import failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
