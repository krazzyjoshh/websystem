import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '../../Components/SellerLayout';
import '../Admin/Admin.scss';

export default function SellerOrders({ orders }) {
    const statusColors = { pending: 'badge-warning', confirmed: 'badge-cyan', processing: 'badge-purple', shipped: 'badge-cyan', delivered: 'badge-success', cancelled: 'badge-danger' };

    return (
        <SellerLayout title="My Orders">
            <Head title="Seller - Orders" />
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead><tr><th>Order #</th><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                        {orders.data.map((item) => (
                            <tr key={item.id}>
                                <td style={{ color: '#00F0FF', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{item.order?.order_number}</td>
                                <td style={{ fontWeight: 600, color: '#FFF' }}>{item.product?.name || item.product_name}</td>
                                <td>{item.order?.user?.name}</td>
                                <td>{item.quantity}</td>
                                <td style={{ fontWeight: 600 }}>₱{parseFloat(item.total).toLocaleString()}</td>
                                <td><span className={`badge ${statusColors[item.order?.status]}`}>{item.order?.status}</span></td>
                                <td style={{ color: '#666' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
