import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, ChevronRight, LogOut } from 'lucide-react';
import '../Pages/Admin/Admin.scss';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
    { icon: Package, label: 'My Products', href: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/seller/orders' },
];

export default function SellerLayout({ children, title }) {
    const { url } = usePage();

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <Link href="/" className="admin-sidebar__logo">
                        <span className="admin-sidebar__logo-text">SHOP</span>
                        <span className="admin-sidebar__logo-accent">HUB</span>
                    </Link>
                    <span className="admin-sidebar__badge" style={{ background: 'rgba(0,240,255,0.15)', color: '#00F0FF' }}>SELLER</span>
                </div>
                <nav className="admin-sidebar__nav">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`admin-sidebar__item ${url.startsWith(item.href) ? 'admin-sidebar__item--active' : ''}`}>
                            <item.icon size={18} /><span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar__footer">
                    <Link href="/" className="admin-sidebar__item"><ChevronRight size={18} /> View Store</Link>
                    <Link href="/logout" method="post" as="button" className="admin-sidebar__item admin-sidebar__item--danger"><LogOut size={18} /> Logout</Link>
                </div>
            </aside>
            <main className="admin-main">
                <div className="admin-main__header"><h1 className="admin-main__title">{title}</h1></div>
                <div className="admin-main__content">{children}</div>
            </main>
        </div>
    );
}
