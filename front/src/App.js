// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PreRegistrationForm from './PreRegistrationForm';
import UseCouponPage from './UseCouponPage';

const images = [
  `${process.env.PUBLIC_URL}/images/1731806820349.jpg`,
  `${process.env.PUBLIC_URL}/images/1731806825200.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807191481.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807231234.jpg`
];

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const MainContent = () => (
    <div className="festival-container">
      <nav className="top-nav">
        <div className="nav-container">
          <span>2024 축제명</span>
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
              <span className="title-line">오색 찬란한 가을의 물결 속으로 당신을 초대합니다</span>
            </h1>
          </div>
          
          <div className="image-slider-wrapper">
            <div className="image-slider">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`슬라이드 ${index + 1}`}
                  className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
                  onLoad={handleImageLoad}
                />
              ))}
            </div>
            {!imagesLoaded && <div className="loading">Loading...</div>}
          </div>
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