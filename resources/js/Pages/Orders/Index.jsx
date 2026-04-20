import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Package, Eye, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import '../Cart.scss';

export default function OrdersIndex({ orders }) {
    const statusConfig = {
        pending:    { label: 'Pending',    bg: '#F3F4F6', color: '#111827', icon: Clock },
        confirmed:  { label: 'Confirmed',  bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
        processing: { label: 'Processing', bg: '#DBEAFE', color: '#1E40AF', icon: Clock },
        shipped:    { label: 'Shipped',    bg: '#EDE9FE', color: '#5B21B6', icon: Truck },
        delivered:  { label: 'Delivered',  bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
        cancelled:  { label: 'Cancelled',  bg: '#FEE2E2', color: '#991B1B', icon: XCircle },
    };

    const paymentConfig = {
        cod:    { label: 'Cash on Delivery', bg: '#111827', color: '#FFFFFF' },
        gcash:  { label: 'GCash',            bg: '#111827', color: '#FFFFFF' },
        maya:   { label: 'Maya',             bg: '#111827', color: '#FFFFFF' },
        online: { label: 'Online',           bg: '#111827', color: '#FFFFFF' },
    };

    return (
        <Layout>
            <Head title="My Orders" />
            <div style={{ background: '#F8F9FA', minHeight: '100vh', paddingTop: 24 }}>
                <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                        My Orders
                    </h1>
                    <p style={{ color: '#6B7280', marginBottom: 32, fontSize: 14 }}>Track and manage your orders</p>

                    {orders.data.length === 0 ? (
                        <div style={{ background: '#FFF', borderRadius: 16, padding: 64, textAlign: 'center', border: '1px solid #F3F4F6' }}>
                            <Package size={64} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                            <h2 style={{ fontSize: 20, color: '#374151', marginBottom: 8 }}>No orders yet</h2>
                            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>Start shopping to see your orders here!</p>
                            <Link href="/products" style={{ display: 'inline-block', background: '#111827', color: '#FFF', padding: '12px 28px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>Browse Products</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {orders.data.map((order) => {
                                const status = statusConfig[order.status] || { label: order.status, bg: '#F3F4F6', color: '#111827' };
                                const payment = paymentConfig[order.payment_method] || { label: order.payment_method?.toUpperCase(), bg: '#111827', color: '#FFF' };
                                const StatusIcon = status.icon;
                                return (
                                    <div key={order.id} style={{ background: '#FFF', borderRadius: 16, border: '1px solid #F3F4F6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                        {/* Header */}
                                        <div style={{ padding: '16px 24px', background: '#FAFAFA', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: '#111827' }}>{order.order_number}</span>
                                                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: status.bg, color: status.color, fontSize: 12, fontWeight: 600 }}>
                                                    <StatusIcon size={12} /> {status.label}
                                                </span>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 999, background: payment.bg, color: payment.color, fontSize: 12, fontWeight: 600 }}>
                                                    {payment.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div style={{ padding: '16px 24px' }}>
                                            {order.items?.slice(0, 3).map((item) => (
                                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                                    <div style={{ width: 42, height: 42, borderRadius: 8, background: '#F3F4F6', overflow: 'hidden', flexShrink: 0 }}>
                                                        {item.product?.main_image && <img src={item.product.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{item.product_name}</p>
                                                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Qty: {item.quantity} · ₱{parseFloat(item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>+{order.items.length - 3} more items</p>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div style={{ padding: '12px 24px', background: '#FAFAFA', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Order Total</span>
                                                <p style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>₱{parseFloat(order.total).toLocaleString()}</p>
                                            </div>
                                            <Link href={`/orders/${order.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#FFF', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                                                <Eye size={14} /> View Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
