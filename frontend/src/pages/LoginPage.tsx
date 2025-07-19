import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Gunakan axios biasa karena ini adalah rute publik
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            toast.success(response.data.message);
            
            // Simpan token ke local storage
            localStorage.setItem('token', response.data.token);
            
            // Arahkan ke halaman utama setelah berhasil login
            setTimeout(() => navigate('/'), 1000);

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login gagal!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster />
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Register di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;