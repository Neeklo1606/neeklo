<?php

namespace App\Observers;

use App\Models\Service;
use App\Support\CmsCacheInvalidator;

class ServiceObserver
{
    public function saved(Service $service): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('service', $service->slug);
    }

    public function deleted(Service $service): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('service', $service->slug);
    }

    protected function getGridPageSlugs(): array
    {
        return config('cms.public_pages_to_invalidate', [
            'home', 'services', 'blog', 'case-studies', 'work',
        ]);
    }
}
