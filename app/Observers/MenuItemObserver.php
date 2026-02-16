<?php

namespace App\Observers;

use App\Models\MenuItem;
use App\Support\CmsCacheInvalidator;

class MenuItemObserver
{
    public function saved(MenuItem $menuItem): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }

    public function deleted(MenuItem $menuItem): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }
}
