import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        await toast.promise(
            // Gunakan axios biasa karena ini adalah rute publik
            axios.post('http://localhost:5000/api/auth/register', { username, password }),
            {
                loading: 'Mendaftarkan...',
                success: (res) => {
                    setTimeout(() => navigate('/login'), 1000);
                    return <b>{res.data.message}</b>;
                },
                error: (err) => <b>{err.response?.data?.message || 'Registrasi gagal!'}</b>,
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster />
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register Akun Baru</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Register
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;