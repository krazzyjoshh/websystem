<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total')
            + Order::where('status', 'delivered')->sum('total');
        $totalOrders = Order::count();
        $totalUsers = User::where('role', 'user')->count();
        $totalProducts = Product::where('is_active', true)->count();
        $totalSellers = User::where('role', 'seller')->count();

        // Monthly revenue for chart (last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = Order::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('total');
            $monthlyRevenue[] = [
                'month' => $date->format('M'),
                'revenue' => (float) $revenue,
            ];
        }

        // Category performance
        $categoryPerformance = Category::withCount('products')
            ->get()
            ->map(function ($cat) {
                return [
                    'name' => $cat->name,
                    'products' => $cat->products_count,
                    'sales' => OrderItem::whereHas('product', function ($q) use ($cat) {
                        $q->where('category_id', $cat->id);
                    })->sum('total'),
                ];
            });

        // Recent orders
        $recentOrders = Order::with('user', 'items')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Order status distribution
        $orderStatuses = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalSellers' => $totalSellers,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'categoryPerformance' => $categoryPerformance,
            'recentOrders' => $recentOrders,
            'orderStatuses' => $orderStatuses,
        ]);
    }
}
