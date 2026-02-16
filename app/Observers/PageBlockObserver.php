<?php

namespace App\Observers;

use App\Models\PageBlock;
use App\Support\CmsCacheInvalidator;

class PageBlockObserver
{
    public function saved(PageBlock $block): void
    {
        $page = $block->page ?? $block->page()->first();
        if ($page) {
            app(CmsCacheInvalidator::class)->forgetPage($page->slug);
        }
    }

    public function deleted(PageBlock $block): void
    {
        $page = $block->page ?? $block->page()->first();
        if ($page) {
            app(CmsCacheInvalidator::class)->forgetPage($page->slug);
        }
    }
}
