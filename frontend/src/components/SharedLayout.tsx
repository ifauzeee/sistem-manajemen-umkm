import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import toast, { Toaster } from 'react-hot-toast';

const SharedLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Logout berhasil!");
        setTimeout(() => navigate('/login'), 500);
    };

    return (
        <div className="flex bg-background text-text-primary font-sans">
            {/* Konfigurasi Toaster untuk tema gelap */}
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1E1E1E', // Warna surface
                        color: '#E5E5E5',       // Warna text-primary
                        border: '1px solid #2D2D2D' // Warna border-color
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981', // Warna secondary
                            secondary: '#1E1E1E',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444', // Warna danger
                            secondary: '#1E1E1E',
                        },
                    },
                }}
            />
            <Sidebar handleLogout={handleLogout} />
            <main className="flex-1 h-screen overflow-y-auto p-8 ml-64">
                <Outlet /> {/* Konten halaman (Dashboard, Produk, Kasir) akan dirender di sini */}
            </main>
        </div>
    );
};

export default SharedLayout;