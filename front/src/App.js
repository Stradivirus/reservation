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
            
            
          </div>

          <div className="registration-container">
            <PreRegistrationForm />
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-icons">
          <div className="nav-icon">축제 기간&nbsp;&nbsp; 2024. 09. 01 ~ 10. 31</div>
         
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