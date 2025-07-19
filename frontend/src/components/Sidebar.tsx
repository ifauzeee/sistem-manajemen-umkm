import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Layers } from 'lucide-react';

// Tipe props untuk Sidebar
interface SidebarProps {
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
    // Fungsi untuk menentukan class NavLink yang aktif
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
            isActive
                ? 'bg-primary/10 text-primary' // Latar belakang emas transparan dengan teks emas
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
        }`;

    return (
        <aside className="w-64 h-screen bg-surface/80 backdrop-blur-lg border-r border-border-color flex flex-col p-4 fixed">
            <div className="text-2xl font-display font-bold text-text-primary mb-12 pl-4">
                UMKM Pro
            </div>
            <nav className="flex flex-col gap-2">
                <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="mr-3" size={20} />
                    Dashboard
                </NavLink>
                <NavLink to="/" className={navLinkClass} end>
                    <Package className="mr-3" size={20} />
                    Produk
                </NavLink>
                <NavLink to="/kategori" className={navLinkClass}>
                    <Layers className="mr-3" size={20} />
                    Kategori
                </NavLink>
                <NavLink to="/kasir" className={navLinkClass}>
                    <ShoppingCart className="mr-3" size={20} />
                    Kasir
                </NavLink>
            </nav>
            <div className="mt-auto">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors duration-200 text-sm font-medium"
                >
                    <LogOut className="mr-3" size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;