import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Package, Eye } from 'lucide-react';
import '../Cart.scss';

export default function OrdersIndex({ orders }) {
    const statusColors = {
        pending: 'badge-warning', confirmed: 'badge-cyan', processing: 'badge-purple',
        shipped: 'badge-cyan', delivered: 'badge-success', cancelled: 'badge-danger',
    };

    return (
        <Layout>
            <Head title="My Orders" />
            <div className="orders-page">
                <div className="container">
                    <h1 className="section-title">MY <span className="gradient-text">ORDERS</span></h1>

                    {orders.data.length === 0 ? (
                        <div className="cart-empty glass-card">
                            <Package size={64} className="cart-empty__icon" />
                            <h2>No orders yet</h2>
                            <p>Start shopping to see your orders here!</p>
                            <Link href="/products" className="btn-primary">Browse Products</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.data.map((order) => (
                                <div key={order.id} className="order-card glass-card">
                                    <div className="order-card__header">
                                        <div>
                                            <span className="order-card__number">{order.order_number}</span>
                                            <span className="order-card__date" style={{ marginLeft: 12 }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                                    </div>
                                    <div className="order-card__items">
                                        {order.items?.slice(0, 3).map((item) => (
                                            <span key={item.id} style={{ fontSize: 13, color: '#A3A3A3' }}>
                                                {item.product_name} ×{item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="order-card__footer">
                                        <span className="order-card__total">₱{parseFloat(order.total).toLocaleString()}</span>
                                        <Link href={`/orders/${order.id}`} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
                                            <Eye size={14} /> View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
