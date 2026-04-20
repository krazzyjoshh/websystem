import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import './Cart.scss';

export default function Cart({ cartItems, cartTotal }) {
    const updateQuantity = (itemId, quantity) => {
        router.put(`/cart/${itemId}`, { quantity }, { preserveScroll: true });
    };

    const removeItem = (itemId) => {
        router.delete(`/cart/${itemId}`, { preserveScroll: true });
    };

    const shippingFee = cartTotal >= 5000 ? 0 : 150;

    return (
        <Layout>
            <Head title="Cart" />
            <div className="cart-page">
                <div className="container">
                    <h1 className="section-title">
                        SHOPPING <span className="gradient-text">CART</span>
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="cart-empty glass-card">
                            <ShoppingBag size={64} className="cart-empty__icon" />
                            <h2>Your cart is empty</h2>
                            <p>Start adding products to your cart!</p>
                            <Link href="/products" className="btn-primary">
                                Browse Products <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item glass-card">
                                        <div className="cart-item__image">
                                            <img src={item.product.main_image || item.product.images?.[0]?.image_path} alt={item.product.name} />
                                        </div>
                                        <div className="cart-item__info">
                                            <Link href={`/products/${item.product.slug}`} className="cart-item__name">
                                                {item.product.name}
                                            </Link>
                                            {item.selected_color && (
                                                <p className="cart-item__variant">Color: {item.selected_color}</p>
                                            )}
                                            <p className="cart-item__price">₱{parseFloat(item.product.price).toLocaleString()}</p>
                                        </div>
                                        <div className="cart-item__quantity">
                                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="cart-item__subtotal">
                                            ₱{item.subtotal.toLocaleString()}
                                        </div>
                                        <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary glass-card">
                                <h3 className="cart-summary__title">Order Summary</h3>
                                <div className="cart-summary__row">
                                    <span>Subtotal</span>
                                    <span>₱{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span>
                                    <span>{shippingFee === 0 ? <span style={{ color: '#10B981' }}>FREE</span> : `₱${shippingFee}`}</span>
                                </div>
                                <div className="cart-summary__divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span>
                                    <span>₱{(cartTotal + shippingFee).toLocaleString()}</span>
                                </div>
                                <Link href="/checkout" className="btn-primary cart-summary__checkout">
                                    Proceed to Checkout <ArrowRight size={18} />
                                </Link>
                                <Link href="/products" className="btn-ghost" style={{ width: '100%', marginTop: 8 }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
