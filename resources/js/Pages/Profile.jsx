import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { User, Lock, Save } from 'lucide-react';
import './Cart.scss';

export default function Profile({ user }) {
    const [profile, setProfile] = useState({
        name: user.name || '', phone: user.phone || '', address: user.address || '',
        city: user.city || '', province: user.province || '', zip_code: user.zip_code || '', avatar: null
    });
    const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });

    const updateProfile = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (profile[key] !== null) formData.append(key, profile[key]);
        });
        formData.append('_method', 'put');
        router.post('/profile', formData);
    };

    const updatePassword = (e) => {
        e.preventDefault();
        router.put('/profile/password', passwords, {
            onSuccess: () => setPasswords({ current_password: '', password: '', password_confirmation: '' }),
        });
    };

    return (
        <Layout>
            <Head title="My Profile" />
            <div className="profile-page">
                <div className="container">
                    <h1 className="section-title">MY <span className="gradient-text">PROFILE</span></h1>
                    <div className="profile-grid">
                        <form onSubmit={updateProfile} className="profile-card glass-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={32} color="#888" />
                                    </div>
                                )}
                                <div>
                                    <label style={{ fontSize: 13, color: '#A3A3A3', display: 'block', marginBottom: 4 }}>Profile Picture</label>
                                    <input type="file" accept="image/*" onChange={(e) => setProfile({ ...profile, avatar: e.target.files[0] })} style={{ color: '#FFF' }} />
                                </div>
                            </div>
                            <h3 className="profile-card__title"><User size={18} style={{ display: 'inline', marginRight: 8 }} />Account Details</h3>
                            {[
                                { label: 'Full Name', key: 'name' },
                                { label: 'Phone', key: 'phone' },
                                { label: 'Address', key: 'address' },
                                { label: 'City', key: 'city' },
                                { label: 'Province', key: 'province' },
                                { label: 'Zip Code', key: 'zip_code' },
                            ].map(({ label, key }) => (
                                <div key={key} className="form-group">
                                    <label>{label}</label>
                                    <input className="form-input" value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} />
                                </div>
                            ))}
                            <button type="submit" className="btn-primary"><Save size={16} /> Save Changes</button>
                        </form>

                        <form onSubmit={updatePassword} className="profile-card glass-card">
                            <h3 className="profile-card__title"><Lock size={18} style={{ display: 'inline', marginRight: 8 }} />Change Password</h3>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" className="form-input" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" className="form-input" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" className="form-input" value={passwords.password_confirmation} onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary"><Lock size={16} /> Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
