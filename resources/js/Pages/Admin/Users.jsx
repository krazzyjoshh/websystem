import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Search, Edit2, Trash2, X } from 'lucide-react';
import './Admin.scss';

export default function AdminUsers({ users, filters }) {
    const [editUser, setEditUser] = useState(null);

    const handleSearch = (search) => {
        router.get('/admin/users', { ...filters, search }, { preserveState: true });
    };

    const handleRoleFilter = (role) => {
        router.get('/admin/users', { ...filters, role }, { preserveState: true });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(`/admin/users/${editUser.id}`, editUser, {
            onSuccess: () => setEditUser(null),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout title="Users Management">
            <Head title="Admin - Users" />

            <div className="admin-toolbar">
                <div className="admin-toolbar__search">
                    <Search size={16} style={{ color: '#666' }} />
                    <input placeholder="Search users..." defaultValue={filters?.search} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="admin-toolbar__actions">
                    {['', 'user', 'seller', 'admin'].map((role) => (
                        <button key={role} className={`btn-ghost ${filters?.role === role ? 'btn-outline' : ''}`} onClick={() => handleRoleFilter(role)} style={{ padding: '8px 14px', fontSize: 12 }}>
                            {role || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id}>
                                <td style={{ fontWeight: 600, color: '#FFF' }}>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`badge ${user.role === 'admin' ? 'badge-purple' : user.role === 'seller' ? 'badge-cyan' : 'badge-success'}`}>{user.role}</span></td>
                                <td style={{ color: '#666' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn-ghost" style={{ padding: 6 }} onClick={() => setEditUser({ ...user })}><Edit2 size={14} /></button>
                                        {user.role !== 'admin' && <button className="btn-ghost" style={{ padding: 6, color: '#EF4444' }} onClick={() => handleDelete(user.id)}><Trash2 size={14} /></button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <div className="admin-modal-overlay" onClick={() => setEditUser(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>Edit User</h2>
                            <button className="admin-modal__close" onClick={() => setEditUser(null)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group"><label>Name</label><input className="form-input" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} /></div>
                            <div className="form-group"><label>Email</label><input className="form-input" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} /></div>
                            <div className="form-group"><label>Role</label>
                                <select className="form-select" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                                    <option value="user">User</option><option value="seller">Seller</option><option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="admin-modal__actions">
                                <button type="button" className="btn-ghost" onClick={() => setEditUser(null)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
