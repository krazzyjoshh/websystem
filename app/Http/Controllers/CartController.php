<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
        $items = $cart->items()->with('product.images')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'selected_color' => $item->selected_color,
                'selected_size' => $item->selected_size,
                'product' => array_merge($item->product->toArray(), [
                    'main_image' => $item->product->main_image,
                ]),
                'subtotal' => $item->subtotal,
            ];
        });

        return Inertia::render('Cart', [
            'cartItems' => $items,
            'cartTotal' => $items->sum('subtotal'),
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:10',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
        $product = Product::findOrFail($request->product_id);

        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => min($existingItem->quantity + ($request->quantity ?? 1), $product->stock),
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity ?? 1,
                'selected_color' => $request->color,
                'selected_size' => $request->size,
            ]);
        }

        return back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        if ($cartItem->cart->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        return back()->with('success', 'Cart updated!');
    }

    public function remove(CartItem $cartItem)
    {
        if ($cartItem->cart->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->delete();
        return back()->with('success', 'Item removed from cart!');
    }
}
