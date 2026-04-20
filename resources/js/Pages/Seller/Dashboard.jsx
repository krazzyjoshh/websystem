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
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
        }],
    };

    return (
        <SellerLayout title="Seller Dashboard">
            <Head title="Seller Dashboard" />
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="admin-stat-card__label"><DollarSign size={16}/> Monthly Earnings</div>
                    <div className="admin-stat-card__value">₱{(stats.monthlyEarnings || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                    <div className="admin-stat-card__trend"><TrendingUp size={14} /> This month</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-card__label"><Package size={16}/> Total Products</div>
                    <div className="admin-stat-card__value">{stats.totalProducts}</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-card__label"><ShoppingCart size={16}/> Products Sold</div>
                    <div className="admin-stat-card__value">{stats.totalSold}</div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                <h3 className="admin-chart-card__title">Earnings Trend</h3>
                <div style={{ height: 280 }}>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#FFF', borderColor: '#E5E7EB', titleColor: '#111827', bodyColor: '#6B7280', borderWidth: 1 } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#6B7280' } }, y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#6B7280' } } } }} />
                </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
                <h3 className="admin-chart-card__title">Recent Orders</h3>
                <table className="admin-table">
                    <thead><tr><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                        {recentOrders.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontWeight: 600 }}>{item.product?.name || item.product_name}</td>
                                <td>{item.order?.user?.name || 'N/A'}</td>
                                <td>{item.quantity}</td>
                                <td style={{ color: '#8B5CF6', fontWeight: 600 }}>₱{parseFloat(item.total).toLocaleString()}</td>
                                <td><span className={`badge ${item.order?.status === 'delivered' ? 'badge-success' : 'badge-cyan'}`}>{item.order?.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
