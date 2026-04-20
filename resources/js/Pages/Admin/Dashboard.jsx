import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { TrendingUp, Users, Package, ShoppingCart, Store, DollarSign } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './Admin.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard({ stats, monthlyRevenue, categoryPerformance, recentOrders, orderStatuses, notifications = [] }) {
    const lineData = {
        labels: monthlyRevenue.map(m => m.month),
        datasets: [{
            label: 'Revenue (₱)',
            data: monthlyRevenue.map(m => m.revenue),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
        }],
    };

    // Doughnut - Category
    const doughnutData = {
        labels: categoryPerformance.map(c => c.name),
        datasets: [{
            data: categoryPerformance.map(c => c.products),
            backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                titleColor: '#111827',
                bodyColor: '#6B7280',
                padding: 12,
                boxPadding: 4,
            }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#6B7280' } },
            y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#6B7280' } },
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
                    { icon: DollarSign, label: 'Total Revenue', value: `₱${(stats.totalRevenue || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
                    { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders },
                    { icon: Users, label: 'Total Users', value: stats.totalUsers },
                    { icon: Package, label: 'Active Products', value: stats.totalProducts },
                ].map((stat, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className="admin-stat-card__label"><stat.icon size={16} /> {stat.label}</div>
                        <div className="admin-stat-card__value">{stat.value}</div>
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

            {/* Bottom Grid: Notifications & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, marginTop: 24 }}>
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
                                        <td style={{ color: '#8B5CF6', fontWeight: 600 }}>{order.order_number}</td>
                                        <td>{order.user?.name || 'N/A'}</td>
                                        <td style={{ fontWeight: 600 }}>₱{parseFloat(order.total).toLocaleString()}</td>
                                        <td><span className="badge badge-purple">{order.payment_method?.toUpperCase()}</span></td>
                                        <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                                        <td style={{ color: '#6B7280' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notifications Board */}
                <div className="glass-card" style={{ padding: 24, alignSelf: 'start' }}>
                    <h3 className="admin-chart-card__title">Notifications Board</h3>
                    <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {notifications.length > 0 ? notifications.map(note => (
                            <div key={note.id} style={{ padding: 12, background: '#F9FAFB', borderRadius: 8, borderLeft: `3px solid ${note.type === 'warning' ? '#F59E0B' : '#8B5CF6'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <strong style={{ fontSize: 14, color: '#111827' }}>{note.title}</strong>
                                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{note.time}</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{note.message}</p>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: '#666', fontSize: 13 }}>
                                No new notifications.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
