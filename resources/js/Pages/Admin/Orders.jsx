import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Search } from 'lucide-react';
import './Admin.scss';

export default function AdminOrders({ orders, filters }) {
    const statusColors = { pending: 'badge-warning', confirmed: 'badge-cyan', processing: 'badge-purple', shipped: 'badge-cyan', delivered: 'badge-success', cancelled: 'badge-danger' };
    const nextStatus = { pending: 'confirmed', confirmed: 'processing', processing: 'shipped', shipped: 'delivered' };

    const updateStatus = (orderId, status) => {
        router.put(`/admin/orders/${orderId}/status`, { status });
    };

    return (
        <AdminLayout title="Orders Management">
            <Head title="Admin - Orders" />
            <div className="admin-toolbar">
                <div className="admin-toolbar__search">
                    <Search size={16} style={{ color: '#666' }} />
                    <input placeholder="Search order number..." defaultValue={filters?.search} onChange={(e) => router.get('/admin/orders', { ...filters, search: e.target.value }, { preserveState: true })} />
                </div>
                <div className="admin-toolbar__actions">
                    {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <button key={s} className={`btn-ghost ${filters?.status === s ? 'btn-outline' : ''}`} onClick={() => router.get('/admin/orders', { ...filters, status: s }, { preserveState: true })} style={{ padding: '8px 12px', fontSize: 11, textTransform: 'capitalize' }}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {orders.data.map((order) => (
                            <tr key={order.id}>
                                <td style={{ color: '#00F0FF', fontWeight: 600, fontFamily: 'Space Grotesk' }}>{order.order_number}</td>
                                <td>{order.user?.name}</td>
                                <td>{order.items?.length} items</td>
                                <td style={{ fontWeight: 600 }}>₱{parseFloat(order.total).toLocaleString()}</td>
                                <td><span className="badge badge-purple">{order.payment_method?.toUpperCase()}</span></td>
                                <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                                <td>
                                    {nextStatus[order.status] && (
                                        <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => updateStatus(order.id, nextStatus[order.status])}>
                                            → {nextStatus[order.status]}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
