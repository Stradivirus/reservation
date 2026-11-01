import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import UseCouponPage from './pages/UseCouponPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-stone-950 text-stone-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/use-coupon" element={<UseCouponPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/list" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
