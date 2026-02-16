<?php

namespace App\Providers;

use App\Models\CaseStudy;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PageBlock;
use App\Models\PersonalAccessToken;
use App\Models\Post;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Taxonomy;
use App\Observers\CaseStudyObserver;
use App\Observers\MenuObserver;
use App\Observers\MenuItemObserver;
use App\Observers\PageBlockObserver;
use App\Observers\PageObserver;
use App\Observers\PostObserver;
use App\Observers\ServiceObserver;
use App\Observers\SettingObserver;
use App\Observers\TaxonomyObserver;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Используем кастомную модель PersonalAccessToken
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Public API cache invalidation observers
        Setting::observe(SettingObserver::class);
        Menu::observe(MenuObserver::class);
        MenuItem::observe(MenuItemObserver::class);
        Page::observe(PageObserver::class);
        PageBlock::observe(PageBlockObserver::class);
        Service::observe(ServiceObserver::class);
        Post::observe(PostObserver::class);
        CaseStudy::observe(CaseStudyObserver::class);
        Taxonomy::observe(TaxonomyObserver::class);
    }
}
