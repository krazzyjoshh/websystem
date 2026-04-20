<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCrudController;
use App\Http\Controllers\Seller\SellerDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes - SHOP HUB
|--------------------------------------------------------------------------
*/

// ─── PUBLIC ───
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/category/{slug}', [ProductController::class, 'byCategory'])->name('category.show');

// ─── AUTH ───
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ─── AUTHENTICATED USER ───
Route::middleware('auth')->group(function () {
    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
});

// ─── ADMIN ───
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [AdminCrudController::class, 'users'])->name('users');
    Route::put('/users/{user}', [AdminCrudController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{user}', [AdminCrudController::class, 'deleteUser'])->name('users.delete');

    Route::get('/products', [AdminCrudController::class, 'products'])->name('products');
    Route::post('/products', [AdminCrudController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [AdminCrudController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [AdminCrudController::class, 'deleteProduct'])->name('products.delete');

    Route::get('/categories', [AdminCrudController::class, 'categories'])->name('categories');
    Route::post('/categories', [AdminCrudController::class, 'storeCategory'])->name('categories.store');
    Route::put('/categories/{category}', [AdminCrudController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCrudController::class, 'deleteCategory'])->name('categories.delete');

    Route::get('/orders', [AdminCrudController::class, 'orders'])->name('orders');
    Route::put('/orders/{order}/status', [AdminCrudController::class, 'updateOrderStatus'])->name('orders.status');

    Route::get('/sellers', [AdminCrudController::class, 'sellers'])->name('sellers');
});

// ─── SELLER ───
Route::middleware(['auth', 'role:seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [SellerDashboardController::class, 'products'])->name('products');
    Route::post('/products', [SellerDashboardController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [SellerDashboardController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [SellerDashboardController::class, 'deleteProduct'])->name('products.delete');
    Route::get('/orders', [SellerDashboardController::class, 'orders'])->name('orders');
});
