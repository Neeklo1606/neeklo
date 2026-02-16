<?php

namespace App\Observers;

use App\Models\CaseStudy;
use App\Support\CmsCacheInvalidator;

class CaseStudyObserver
{
    public function saved(CaseStudy $caseStudy): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('case-study', $caseStudy->slug);
    }

    public function deleted(CaseStudy $caseStudy): void
    {
        $inv = app(CmsCacheInvalidator::class);
        $inv->forgetPages($this->getGridPageSlugs());
        $inv->forgetSitemap();
        $inv->forgetShare('case-study', $caseStudy->slug);
    }

    protected function getGridPageSlugs(): array
    {
        return config('cms.public_pages_to_invalidate', [
            'home', 'services', 'blog', 'case-studies', 'work',
        ]);
    }
}
