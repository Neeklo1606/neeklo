<?php

namespace App\Observers;

use App\Models\Menu;
use App\Support\CmsCacheInvalidator;

class MenuObserver
{
    public function saved(Menu $menu): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }

    public function deleted(Menu $menu): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }
}
