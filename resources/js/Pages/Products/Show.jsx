import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft, Plus, Minus, ChevronRight } from 'lucide-react';
import './Products.scss';

export default function ProductShow({ product, relatedProducts }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        if (!auth?.user) { router.visit('/login'); return; }
        router.post('/cart/add', { product_id: product.id, quantity, color: product.color });
    };

    const buyNow = () => {
        if (!auth?.user) { router.visit('/login'); return; }
        router.post('/cart/add', { product_id: product.id, quantity, color: product.color }, {
            onSuccess: () => router.visit('/checkout')
        });
    };

    const images = product.images || [];
    const currentImage = images[selectedImage]?.image_path || product.main_image;

    return (
        <Layout>
            <Head title={product.name} />

            <div className="product-detail">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="product-detail__breadcrumb">
                        <Link href="/">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/products">Products</Link>
                        <ChevronRight size={14} />
                        <Link href={`/products?category=${product.category_id}`}>{product.category?.name}</Link>
                        <ChevronRight size={14} />
                        <span>{product.name}</span>
                    </div>

                    <div className="product-detail__grid">
                        {/* Image Gallery */}
                        <div className="product-detail__gallery">
                            <div className="product-detail__main-image glass-card">
                                <img src={currentImage} alt={product.name} />
                                {product.discount_percent > 0 && (
                                    <div className="product-card__discount">-{product.discount_percent}%</div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="product-detail__thumbnails">
                                    {images.map((img, i) => (
                                        <button
                                            key={img.id}
                                            className={`product-detail__thumb ${i === selectedImage ? 'product-detail__thumb--active' : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        >
                                            <img src={img.image_path} alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="product-detail__info glass-card">
                            <div className="product-detail__category-badge">
                                {product.category?.name}
                            </div>

                            <h1 className="product-detail__name">{product.name}</h1>

                            <div className="product-detail__rating-row">
                                <div className="product-detail__stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            fill={star <= Math.round(product.rating) ? '#F59E0B' : 'transparent'}
                                            color={star <= Math.round(product.rating) ? '#F59E0B' : '#666'}
                                        />
                                    ))}
                                    <span>{product.rating}</span>
                                </div>
                                <span className="product-detail__reviews">({product.review_count} reviews)</span>
                                <span className="product-detail__sold">{product.sales_count} sold</span>
                            </div>

                            <div className="product-detail__price-box">
                                <span className="product-detail__price">₱{parseFloat(product.price).toLocaleString()}</span>
                                {product.compare_price && (
                                    <>
                                        <span className="product-detail__compare-price">₱{parseFloat(product.compare_price).toLocaleString()}</span>
                                        <span className="product-detail__save">Save ₱{(product.compare_price - product.price).toLocaleString()}</span>
                                    </>
                                )}
                            </div>

                            <p className="product-detail__description">{product.description}</p>

                            {/* Specs */}
                            {product.specifications && (
                                <div className="product-detail__specs">
                                    <h3>Specifications</h3>
                                    <div className="product-detail__specs-table">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="product-detail__spec-row">
                                                <span className="product-detail__spec-label">{key}</span>
                                                <span className="product-detail__spec-value">{value}</span>
                                            </div>
                                        ))}
                                        {product.brand && (
                                            <div className="product-detail__spec-row">
                                                <span className="product-detail__spec-label">Brand</span>
                                                <span className="product-detail__spec-value">{product.brand}</span>
                                            </div>
                                        )}
                                        {product.stock > 0 && (
                                            <div className="product-detail__spec-row">
                                                <span className="product-detail__spec-label">Availability</span>
                                                <span className="product-detail__spec-value" style={{ color: '#10B981' }}>In Stock ({product.stock})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Color */}
                            {product.color && (
                                <div className="product-detail__option">
                                    <label>Color: <strong>{product.color}</strong></label>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="product-detail__quantity">
                                <label>Quantity</label>
                                <div className="product-detail__quantity-control">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={16} /></button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="product-detail__actions" style={{ display: 'flex', gap: 12 }}>
                                <button className="btn-primary product-detail__add-cart" onClick={addToCart} disabled={product.stock <= 0} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <ShoppingCart size={18} />
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                {product.stock > 0 && (
                                    <button onClick={buyNow} style={{ padding: '0 24px', background: '#EDE9FE', color: '#7C3AED', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.target.style.background = '#DDD6FE'}
                                        onMouseLeave={e => e.target.style.background = '#EDE9FE'}
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="product-detail__trust">
                                <div className="product-detail__trust-item">
                                    <Truck size={16} />
                                    <span>Free shipping over ₱5,000</span>
                                </div>
                                <div className="product-detail__trust-item">
                                    <Shield size={16} />
                                    <span>Buyer protection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="product-reviews">
                            <h2 className="section-title">Customer <span className="gradient-text">Reviews</span></h2>
                            <div className="product-reviews__list">
                                {product.reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="review-card glass-card">
                                        <div className="review-card__header">
                                            <div className="review-card__avatar">{review.user?.name?.charAt(0)}</div>
                                            <div>
                                                <p className="review-card__name">{review.user?.name}</p>
                                                <div className="review-card__stars">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={12} fill={s <= review.rating ? '#F59E0B' : 'transparent'} color={s <= review.rating ? '#F59E0B' : '#666'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="review-card__comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="related-products">
                            <h2 className="section-title">Related <span className="gradient-text">Products</span></h2>
                            <div className="products-grid">
                                {relatedProducts.map((p) => (
                                    <Link key={p.id} href={`/products/${p.slug}`} className="product-card glass-card">
                                        {p.discount_percent > 0 && <div className="product-card__discount">-{p.discount_percent}%</div>}
                                        <div className="product-card__image">
                                            <img src={p.main_image || p.images?.[0]?.image_path} alt={p.name} loading="lazy" />
                                        </div>
                                        <div className="product-card__content">
                                            <h3 className="product-card__name">{p.name}</h3>
                                            <div className="product-card__pricing">
                                                <span className="product-card__price">₱{parseFloat(p.price).toLocaleString()}</span>
                                                {p.compare_price && <span className="product-card__compare">₱{parseFloat(p.compare_price).toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
