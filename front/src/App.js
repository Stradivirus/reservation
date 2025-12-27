import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Main/MainPage';
import UseCouponPage from './pages/UseCoupon/UseCouponPage';
// [추가] 관리자 페이지 임포트
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminListPage from './pages/Admin/AdminListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/use-coupon" element={<UseCouponPage />} />
        
        {/* [추가] 관리자 라우트 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/list" element={<AdminListPage />} />
        <Route path="/admin" element={<AdminLoginPage />} /> {/* 기본 admin 접속 시 로그인으로 */}
      </Routes>
    </Router>
  );
}

export default App;