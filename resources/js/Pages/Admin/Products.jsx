import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import './Admin.scss';

export default function AdminProducts({ products, categories, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', category_id: '', price: '', compare_price: '', description: '', stock: '', brand: '', color: '', material: '', is_featured: false, image_url: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/products', form, { onSuccess: () => { setShowModal(false); setForm({ name: '', category_id: '', price: '', compare_price: '', description: '', stock: '', brand: '', color: '', material: '', is_featured: false, image_url: '' }); } });
    };

    const handleDelete = (id) => { if (confirm('Delete this product?')) router.delete(`/admin/products/${id}`); };

    return (
        <AdminLayout title="Products Management">
            <Head title="Admin - Products" />
            <div className="admin-toolbar">
                <div className="admin-toolbar__search">
                    <Search size={16} style={{ color: '#666' }} />
                    <input placeholder="Search products..." defaultValue={filters?.search} onChange={(e) => router.get('/admin/products', { search: e.target.value }, { preserveState: true })} />
                </div>
                <div className="admin-toolbar__actions">
                    <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Product</button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Actions</th></tr></thead>
                    <tbody>
                        {products.data.map((p) => (
                            <tr key={p.id}>
                                <td><div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#1A1A1A' }}>{p.main_image && <img src={p.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div></td>
                                <td style={{ fontWeight: 600, color: '#FFF' }}>{p.name}</td>
                                <td>{p.category?.name}</td>
                                <td style={{ color: '#00F0FF', fontFamily: 'Space Grotesk', fontWeight: 600 }}>₱{parseFloat(p.price).toLocaleString()}</td>
                                <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                                <td>{p.sales_count}</td>
                                <td><button className="btn-ghost" style={{ padding: 6, color: '#EF4444' }} onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header"><h2>Add Product</h2><button className="admin-modal__close" onClick={() => setShowModal(false)}><X size={18} /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>Product Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Category</label><select className="form-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group"><label>Price (₱)</label><input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                                <div className="form-group"><label>Compare Price</label><input type="number" className="form-input" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Description</label><textarea className="form-input" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div className="form-group"><label>Stock</label><input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
                                <div className="form-group"><label>Brand</label><input className="form-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
                                <div className="form-group"><label>Color</label><input className="form-input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Image URL</label><input className="form-input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
                            <div className="admin-modal__actions"><button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-primary">Create Product</button></div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
