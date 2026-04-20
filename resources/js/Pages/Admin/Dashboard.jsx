import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { TrendingUp, Users, Package, ShoppingCart, Store, DollarSign } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './Admin.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard({ stats, monthlyRevenue, categoryPerformance, recentOrders, orderStatuses }) {
    // Line chart - Monthly Revenue
    const lineData = {
        labels: monthlyRevenue.map(m => m.month),
        datasets: [{
            label: 'Revenue (₱)',
            data: monthlyRevenue.map(m => m.revenue),
            borderColor: '#00F0FF',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00F0FF',
            pointBorderColor: '#0A0A0A',
            pointBorderWidth: 2,
            pointRadius: 5,
        }],
    };

    // Doughnut - Category
    const doughnutData = {
        labels: categoryPerformance.map(c => c.name),
        datasets: [{
            data: categoryPerformance.map(c => c.products),
            backgroundColor: ['#00F0FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'],
            borderColor: '#0A0A0A',
            borderWidth: 3,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(20,20,20,0.9)',
                borderColor: 'rgba(0,240,255,0.2)',
                borderWidth: 1,
                titleColor: '#FFF',
                bodyColor: '#A3A3A3',
            }
        },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666' } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666' } },
        },
    };

    const statusColors = {
        pending: 'badge-warning', confirmed: 'badge-cyan', processing: 'badge-purple',
        shipped: 'badge-cyan', delivered: 'badge-success', cancelled: 'badge-danger',
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats */}
            <div className="admin-stats">
                {[
                    { icon: DollarSign, label: 'Total Revenue', value: `₱${(stats.totalRevenue || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, color: '#00F0FF' },
                    { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: '#8B5CF6' },
                    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#10B981' },
                    { icon: Package, label: 'Active Products', value: stats.totalProducts, color: '#F59E0B' },
                ].map((stat, i) => (
                    <div key={i} className="admin-stat-card glass-card">
                        <div className="admin-stat-card__label">{stat.label}</div>
                        <div className="admin-stat-card__value" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="admin-stat-card__trend">
                            <TrendingUp size={14} /> Active
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="admin-charts">
                <div className="admin-chart-card glass-card">
                    <h3 className="admin-chart-card__title">Sales Trend</h3>
                    <div style={{ height: 280 }}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
                <div className="admin-chart-card glass-card">
                    <h3 className="admin-chart-card__title">Category Distribution</h3>
                    <div style={{ height: 280 }}>
                        <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="glass-card" style={{ padding: 24 }}>
                <h3 className="admin-chart-card__title">Recent Orders</h3>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ color: '#00F0FF', fontWeight: 600, fontFamily: 'Space Grotesk' }}>{order.order_number}</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td style={{ fontWeight: 600 }}>₱{parseFloat(order.total).toLocaleString()}</td>
                                    <td><span className="badge badge-purple">{order.payment_method?.toUpperCase()}</span></td>
                                    <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                                    <td style={{ color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
