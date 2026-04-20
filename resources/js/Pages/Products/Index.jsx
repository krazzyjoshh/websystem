import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Search, SlidersHorizontal, Star, X, ChevronDown } from 'lucide-react';
import './Products.scss';

export default function ProductsIndex({ products, categories, brands, colors, filters }) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});

    const applyFilters = () => {
        const cleaned = Object.fromEntries(Object.entries(localFilters).filter(([_, v]) => v));
        router.get('/products', cleaned, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get('/products', {}, { preserveState: true });
    };

    const handleSort = (sort) => {
        router.get('/products', { ...filters, sort }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <Layout>
            <Head title="Products" />

            <div className="products-page">
                <div className="container">
                    {/* Header */}
                    <div className="products-page__header">
                        <div>
                            <h1 className="section-title">
                                EXPLORE <span className="gradient-text">PRODUCTS</span>
                            </h1>
                            <p className="section-subtitle">
                                {products.total} products found
                            </p>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="products-page__toolbar glass-card">
                        <form className="products-page__search" onSubmit={handleSearch}>
                            <Search size={18} className="products-page__search-icon" />
                            <input
                                type="text"
                                placeholder="Search products, brands, categories..."
                                className="products-page__search-input"
                                value={localFilters.search || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                            />
                        </form>

                        <div className="products-page__toolbar-actions">
                            <select
                                className="form-select products-page__sort"
                                value={filters.sort || 'newest'}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="bestselling">Best Selling</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            <button
                                className="btn-outline products-page__filter-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="filter-panel glass-card">
                            <div className="filter-panel__grid">
                                <div className="filter-panel__group">
                                    <label>Category</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.category || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name} ({cat.products_count})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-panel__group">
                                    <label>Brand</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.brand || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, brand: e.target.value })}
                                    >
                                        <option value="">All Brands</option>
                                        {brands.map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-panel__group">
                                    <label>Min Price (₱)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0"
                                        value={localFilters.min_price || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, min_price: e.target.value })}
                                    />
                                </div>

                                <div className="filter-panel__group">
                                    <label>Max Price (₱)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="100,000"
                                        value={localFilters.max_price || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, max_price: e.target.value })}
                                    />
                                </div>

                                <div className="filter-panel__group">
                                    <label>Color</label>
                                    <select
                                        className="form-select"
                                        value={localFilters.color || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, color: e.target.value })}
                                    >
                                        <option value="">All Colors</option>
                                        {colors.map((color) => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="filter-panel__actions">
                                <button className="btn-primary" onClick={applyFilters}>Apply Filters</button>
                                <button className="btn-ghost" onClick={clearFilters}>
                                    <X size={16} /> Clear All
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="products-grid-page">
                        {products.data.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="product-card glass-card">
                                {product.discount_percent > 0 && (
                                    <div className="product-card__discount">-{product.discount_percent}%</div>
                                )}
                                <div className="product-card__image">
                                    <img src={product.main_image || product.images?.[0]?.image_path} alt={product.name} loading="lazy" />
                                </div>
                                <div className="product-card__content">
                                    <p className="product-card__category">{product.category?.name}</p>
                                    <h3 className="product-card__name">{product.name}</h3>
                                    <div className="product-card__meta">
                                        <div className="product-card__rating">
                                            <Star size={13} fill="#F59E0B" color="#F59E0B" />
                                            <span>{product.rating}</span>
                                        </div>
                                        <span className="product-card__sales">{product.sales_count} sold</span>
                                    </div>
                                    <div className="product-card__pricing">
                                        <span className="product-card__price">₱{parseFloat(product.price).toLocaleString()}</span>
                                        {product.compare_price && (
                                            <span className="product-card__compare">₱{parseFloat(product.compare_price).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="pagination">
                            {products.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`pagination__item ${link.active ? 'pagination__item--active' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
