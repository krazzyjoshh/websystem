<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SellerDashboardController extends Controller
{
    public function index()
    {
        $sellerId = auth()->id();
        $profile = SellerProfile::where('user_id', $sellerId)->first();

        $monthlyEarnings = OrderItem::where('seller_id', $sellerId)
            ->whereHas('order', function ($q) {
                $q->whereMonth('created_at', now()->month);
            })->sum('total');

        $totalProducts = Product::where('seller_id', $sellerId)->count();
        $totalSold = Product::where('seller_id', $sellerId)->sum('sales_count');

        $recentOrders = OrderItem::where('seller_id', $sellerId)
            ->with('order.user', 'product')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Monthly earnings chart
        $monthlyChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $earnings = OrderItem::where('seller_id', $sellerId)
                ->whereHas('order', function ($q) use ($date) {
                    $q->whereMonth('created_at', $date->month)
                      ->whereYear('created_at', $date->year);
                })->sum('total');
            $monthlyChart[] = [
                'month' => $date->format('M'),
                'earnings' => (float) $earnings,
            ];
        }

        return Inertia::render('Seller/Dashboard', [
            'profile' => $profile,
            'stats' => [
                'monthlyEarnings' => $monthlyEarnings,
                'totalProducts' => $totalProducts,
                'totalSold' => $totalSold,
            ],
            'recentOrders' => $recentOrders,
            'monthlyChart' => $monthlyChart,
        ]);
    }

    public function products()
    {
        $products = Product::where('seller_id', auth()->id())
            ->with('images', 'category')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->through(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image]);
            });

        return Inertia::render('Seller/Products', [
            'products' => $products,
            'categories' => Category::all(),
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'category_id' => $request->category_id,
            'seller_id' => auth()->id(),
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'description' => $request->description,
            'stock' => $request->stock,
            'brand' => $request->brand,
            'color' => $request->color,
            'material' => $request->material,
            'is_active' => true,
        ]);

        if ($request->image_url) {
            $product->images()->create([
                'image_path' => $request->image_url,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        return back()->with('success', 'Product created!');
    }

    public function updateProduct(Request $request, Product $product)
    {
        if ($product->seller_id !== auth()->id()) abort(403);

        $product->update($request->only([
            'name', 'price', 'compare_price', 'description', 'stock',
            'brand', 'color', 'material', 'is_active', 'category_id',
        ]));

        return back()->with('success', 'Product updated!');
    }

    public function deleteProduct(Product $product)
    {
        if ($product->seller_id !== auth()->id()) abort(403);
        $product->delete();
        return back()->with('success', 'Product deleted!');
    }

    public function orders()
    {
        $orders = OrderItem::where('seller_id', auth()->id())
            ->with('order.user', 'product')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Seller/Orders', [
            'orders' => $orders,
        ]);
    }
}
