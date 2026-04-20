import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './Admin.scss';

export default function AdminCategories({ categories }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', image: '', icon: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== '') formData.append(key, form[key]);
        });
        router.post('/admin/categories', formData, { onSuccess: () => { setShowModal(false); setForm({ name: '', description: '', image: '', icon: '' }); } });
    };

    const handleDelete = (id) => { if (confirm('Delete this category?')) router.post(`/admin/categories/${id}`, { _method: 'delete' }); };

    return (
        <AdminLayout title="Categories Management">
            <Head title="Admin - Categories" />
            <div className="admin-toolbar">
                <div />
                <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Category</button>
            </div>

            <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {categories.map((cat) => (
                    <div key={cat.id} className="glass-card" style={{ padding: 24, position: 'relative' }}>
                        {cat.image && <div style={{ height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}><img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                        <h3 style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#111827' }}>{cat.name}</h3>
                        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{cat.description}</p>
                        <span className="badge badge-purple">{cat.products_count} Products</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12, color: '#EF4444' }} onClick={() => handleDelete(cat.id)}><Trash2 size={14} /> Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header"><h2>Add Category</h2><button className="admin-modal__close" onClick={() => setShowModal(false)}><X size={18} /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Description</label><textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="form-group">
                                <label>Category Image</label>
                                <input type="file" accept="image/*" className="form-input" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
                            </div>
                            <div className="admin-modal__actions"><button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-primary">Create</button></div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
