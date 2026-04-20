import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, ChevronRight, LogOut, User, Settings } from 'lucide-react';
import '../Pages/Admin/Admin.scss';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/seller/dashboard' },
    { icon: Package, label: 'My Products', href: '/admin/seller/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/seller/orders' },
    { icon: Settings, label: 'Settings', href: '/admin/seller/settings' },
];

export default function SellerLayout({ children, title }) {
    const { url, auth } = usePage();
    const user = auth?.user;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <Link href="/" className="admin-sidebar__logo">
                        <span className="admin-sidebar__logo-text">SHOP</span>
                        <span className="admin-sidebar__logo-accent">HUB</span>
                    </Link>
                    <span className="admin-sidebar__badge" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>SELLER</span>
                </div>

                {/* Profile in sidebar */}
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F3F4F6' }}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#8B5CF6' }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Seller</p>
                    </div>
                </div>

                <nav className="admin-sidebar__nav">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`admin-sidebar__item ${url.startsWith(item.href) ? 'admin-sidebar__item--active' : ''}`}>
                            <item.icon size={18} /><span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar__footer">
                    <Link href="/" className="admin-sidebar__item"><ChevronRight size={18} /> <span>View Store</span></Link>
                    <Link href="/logout" method="post" as="button" className="admin-sidebar__item admin-sidebar__item--danger"><LogOut size={18} /> <span>Logout</span></Link>
                </div>
            </aside>
            <main className="admin-main">
                <div className="admin-main__header">
                    <h1 className="admin-main__title">{title}</h1>
                </div>
                <div className="admin-main__content">{children}</div>
            </main>
        </div>
    );
}
