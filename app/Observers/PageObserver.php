<?php

namespace App\Observers;

use App\Models\Page;
use App\Support\CmsCacheInvalidator;

class PageObserver
{
    public function saved(Page $page): void
    {
        $invalidator = app(CmsCacheInvalidator::class);
        $invalidator->forgetPage($page->slug);
        $invalidator->forgetBootstrap();
        $invalidator->forgetSitemap();
        $invalidator->forgetShare('page', $page->slug);
    }

    public function deleted(Page $page): void
    {
        $invalidator = app(CmsCacheInvalidator::class);
        $invalidator->forgetPage($page->slug);
        $invalidator->forgetBootstrap();
        $invalidator->forgetSitemap();
        $invalidator->forgetShare('page', $page->slug);
    }
}
