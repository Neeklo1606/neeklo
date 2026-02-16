<?php

namespace App\Observers;

use App\Models\Taxonomy;
use App\Support\CmsCacheInvalidator;

class TaxonomyObserver
{
    public function saved(Taxonomy $taxonomy): void
    {
        app(CmsCacheInvalidator::class)->forgetPages($this->getGridPageSlugs());
    }

    public function deleted(Taxonomy $taxonomy): void
    {
        app(CmsCacheInvalidator::class)->forgetPages($this->getGridPageSlugs());
    }

    protected function getGridPageSlugs(): array
    {
        return config('cms.public_pages_to_invalidate', [
            'home', 'services', 'blog', 'case-studies', 'work',
        ]);
    }
}
