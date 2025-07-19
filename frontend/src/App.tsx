import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import SharedLayout from './components/SharedLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import PosPage from './pages/PosPage';
import DashboardPage from './pages/DashboardPage';
import KategoriPage from './pages/KategoriPage'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<SharedLayout />}> 
          <Route path="/" element={<ProductPage />} />
          <Route path="/kategori" element={<KategoriPage />} />
          <Route path="/kasir" element={<PosPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;