import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import './Admin.scss';

export default function AdminProducts({ products, categories, filters }) {

    const handleDelete = (id) => { if (confirm('Delete this product?')) router.post(`/admin/products/${id}`, { _method: 'delete' }); };

    return (
        <AdminLayout title="Products Management">
            <Head title="Admin - Products" />
            <div className="admin-toolbar">
                <div className="admin-toolbar__search">
                    <Search size={16} style={{ color: '#666' }} />
                    <input placeholder="Search products..." defaultValue={filters?.search} onChange={(e) => router.get('/admin/products', { search: e.target.value }, { preserveState: true })} />
                </div>
                <div className="admin-toolbar__actions">
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Actions</th></tr></thead>
                    <tbody>
                        {products.data.map((p) => (
                            <tr key={p.id}>
                                <td><div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#F3F4F6' }}>{p.main_image && <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div></td>
                                <td style={{ fontWeight: 600, color: '#111827' }}>{p.name}</td>
                                <td>{p.category?.name}</td>
                                <td style={{ color: '#8B5CF6', fontFamily: 'Inter', fontWeight: 600 }}>₱{parseFloat(p.price).toLocaleString()}</td>
                                <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                                <td>{p.sales_count}</td>
                                <td><button type="button" className="btn-ghost" style={{ padding: 6, color: '#EF4444' }} onClick={(e) => { e.preventDefault(); handleDelete(p.id); }}><Trash2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </AdminLayout>
    );
}
