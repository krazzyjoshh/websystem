import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '../../Components/SellerLayout';
import { DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import '../Admin/Admin.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SellerDashboard({ profile, stats, recentOrders, monthlyChart }) {
    const lineData = {
        labels: monthlyChart.map(m => m.month),
        datasets: [{
            label: 'Earnings (₱)',
            data: monthlyChart.map(m => m.earnings),
            borderColor: '#00F0FF',
            backgroundColor: 'rgba(0, 240, 255, 0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00F0FF',
            pointBorderColor: '#0A0A0A',
            pointBorderWidth: 2,
        }],
    };

    return (
        <SellerLayout title="Seller Dashboard">
            <Head title="Seller Dashboard" />
            <div className="admin-stats">
                <div className="admin-stat-card glass-card">
                    <div className="admin-stat-card__label">Monthly Earnings</div>
                    <div className="admin-stat-card__value" style={{ color: '#00F0FF' }}>₱{(stats.monthlyEarnings || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                    <div className="admin-stat-card__trend"><TrendingUp size={14} /> This month</div>
                </div>
                <div className="admin-stat-card glass-card">
                    <div className="admin-stat-card__label">Total Products</div>
                    <div className="admin-stat-card__value" style={{ color: '#8B5CF6' }}>{stats.totalProducts}</div>
                </div>
                <div className="admin-stat-card glass-card">
                    <div className="admin-stat-card__label">Products Sold</div>
                    <div className="admin-stat-card__value" style={{ color: '#10B981' }}>{stats.totalSold}</div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#A3A3A3', marginBottom: 20 }}>Earnings Trend</h3>
                <div style={{ height: 280 }}>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666' } } } }} />
                </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#A3A3A3', marginBottom: 20 }}>Recent Orders</h3>
                <table className="admin-table">
                    <thead><tr><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                        {recentOrders.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontWeight: 600, color: '#FFF' }}>{item.product?.name || item.product_name}</td>
                                <td>{item.order?.user?.name || 'N/A'}</td>
                                <td>{item.quantity}</td>
                                <td style={{ color: '#00F0FF', fontWeight: 600 }}>₱{parseFloat(item.total).toLocaleString()}</td>
                                <td><span className={`badge ${item.order?.status === 'delivered' ? 'badge-success' : 'badge-cyan'}`}>{item.order?.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
