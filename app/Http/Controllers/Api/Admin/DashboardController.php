<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BriefSubmission;
use App\Models\CaseModel;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $newSubmissions = BriefSubmission::where('status', 'new')->count();
        $todaySubmissions = BriefSubmission::whereDate('created_at', today())->count();
        $totalCases = CaseModel::count();
        $publishedPosts = Post::where('status', 'published')->count();

        $recentSubmissions = BriefSubmission::orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'phone', 'email', 'company', 'status', 'created_at']);

        return response()->json([
            'new_submissions' => $newSubmissions,
            'today_submissions' => $todaySubmissions,
            'total_cases' => $totalCases,
            'published_posts' => $publishedPosts,
            'recent_submissions' => $recentSubmissions,
        ]);
    }
}
