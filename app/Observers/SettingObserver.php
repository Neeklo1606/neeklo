<?php

namespace App\Observers;

use App\Models\Setting;
use App\Support\CmsCacheInvalidator;

class SettingObserver
{
    public function saved(Setting $setting): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }

    public function deleted(Setting $setting): void
    {
        app(CmsCacheInvalidator::class)->forgetBootstrap();
    }
}
