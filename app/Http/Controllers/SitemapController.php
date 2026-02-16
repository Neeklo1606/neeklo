<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Support\PublicUrlResolver;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $invalidator = app(\App\Support\CmsCacheInvalidator::class);
        $key = $invalidator->sitemapKey();

        $xml = Cache::remember($key, 3600, function () {
            return $this->buildSitemapXml();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }

    protected function buildSitemapXml(): string
    {
        $resolver = app(PublicUrlResolver::class);
        $urls = [];

        // Main page
        $urls[] = $this->urlNode($resolver->absolute('/'), null);

        // CMS pages: home -> /, services -> /services, case-studies -> /cases, work -> /work, etc.
        $pages = Page::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderBy('slug')
            ->get();

        foreach ($pages as $page) {
            $path = $resolver->page($page);
            $urls[] = $this->urlNode($resolver->absolute($path), $page->updated_at);
        }

        // Services: only include if resolver returns a path (real SPA route exists)
        $services = Service::query()
            ->where('status', 'published')
            ->orderBy('position')
            ->get();

        foreach ($services as $service) {
            $path = $resolver->service($service);
            if ($path !== null) {
                $urls[] = $this->urlNode($resolver->absolute($path), $service->updated_at);
            }
        }

        // Posts: /blog/{slug}
        $posts = Post::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->get();

        foreach ($posts as $post) {
            $path = $resolver->post($post);
            if ($path !== null) {
                $urls[] = $this->urlNode($resolver->absolute($path), $post->updated_at);
            }
        }

        // Case studies: /work/{slug}
        $cases = CaseStudy::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->get();

        foreach ($cases as $case) {
            $path = $resolver->caseStudy($case);
            if ($path !== null) {
                $urls[] = $this->urlNode($resolver->absolute($path), $case->updated_at);
            }
        }

        $urlset = implode("\n", $urls);
        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n"
            . $urlset . "\n"
            . '</urlset>';
    }

    protected function urlNode(string $loc, ?\DateTimeInterface $lastmod): string
    {
        $loc = htmlspecialchars($loc, ENT_XML1 | ENT_QUOTES, 'UTF-8');
        $lastmodTag = $lastmod
            ? "    <lastmod>" . Date::instance($lastmod)->toW3cString() . "</lastmod>\n"
            : '';
        return "  <url>\n    <loc>{$loc}</loc>\n{$lastmodTag}  </url>";
    }
}
