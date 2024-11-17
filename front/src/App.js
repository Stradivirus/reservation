// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PreRegistrationForm from './PreRegistrationForm';
import UseCouponPage from './UseCouponPage';
import ImageSlider from './ImageSlider';

function App() {
  const MainContent = () => (
    <div className="festival-container">
      <nav className="top-nav">
        <div className="nav-container">
          <span>2024 하늘공원 축제</span>
          <div className="nav-links">
            <a href="#about">행사안내</a>
            <a href="#location">찾아오시는길</a>
            <a href="#schedule">공연 세부일정</a>
            <a href="#community">커뮤니티</a>
            <a href="#notice">관람객 사전등록</a>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="left-section">
          <div className="title-section">
            <h1 className="main-title">
              <span className="title-line">모든 잎이 꽃이 되는 가을</span>
              <br />
              <span className="title-line">오색 찬란한 가을의 물결 속으로 <br></br>당신을 초대합니다</span>
            </h1>
          </div>
          
          <ImageSlider />
        </div>

        <div className="right-section">
          <div className="event-info">
            <h2>축제 장소</h2>
            <div className="date">2024. 00. 00. (월)</div>
            <div className="time">09:00 - 18:00</div>
          </div>

          <div className="registration-container">
            <PreRegistrationForm />
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-icons">
          <div className="nav-icon">관람객 사전 등록</div>
          <div className="nav-icon">미술 및 체험</div>
          <div className="nav-icon">찾아 가는 힐 티켓</div>
          <div className="nav-icon">양재 플라워 페스타</div>
          <div className="nav-icon">포스트 메시지</div>
        </div>
      </nav>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/use-coupon" element={<UseCouponPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;