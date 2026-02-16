<?php

namespace App\Observers;

use App\Models\Post;
use App\Support\CmsCacheInvalidator;

class PostObserver
{
    public function saved(Post $post): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('post', $post->slug);
    }

    public function deleted(Post $post): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('post', $post->slug);
    }

    protected function getGridPageSlugs(): array
    {
        return config('cms.public_pages_to_invalidate', [
            'home', 'services', 'blog', 'case-studies', 'work',
        ]);
    }
}
