// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PreRegistrationForm from './PreRegistrationForm'; // 사전 등록 폼 컴포넌트 임포트
import UseCouponPage from './UseCouponPage'; // 쿠폰 사용 페이지 컴포넌트 임포트
import ImageSlider from './ImageSlider'; // 이미지 슬라이더 컴포넌트 임포트

function App() {
  // 메인 콘텐츠를 정의하는 함수형 컴포넌트
  const MainContent = () => (
    <div className="festival-container">
      {/* 상단 내비게이션 바 */}
      <nav className="top-nav">
        <div className="nav-container">
          <span>2024 하늘공원 축제</span> {/* 축제 제목 표시 */}
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <div className="main-content">
        <div className="left-section">
          {/* 제목 섹션 */}
          <div className="title-section">
            <h1 className="main-title">
              <span className="title-line">모든 잎이 꽃이 되는 가을</span>
              <br />
              <span className="title-line">오색 찬란한 가을의 물결 속으로 <br></br>당신을 초대합니다</span>
            </h1>
          </div>
          
          {/* 이미지 슬라이더 컴포넌트 */}
          <ImageSlider />
        </div>

        <div className="right-section">
          {/* 이벤트 정보 섹션 (현재 비어 있음) */}
          <div className="event-info">
            {/* 여기에 이벤트 정보 추가 가능 */}
          </div>

          {/* 사전 등록 폼 섹션 */}
          <div className="registration-container">
            <PreRegistrationForm /> {/* 사전 등록 폼 컴포넌트 렌더링 */}
          </div>
        </div>
      </div>

      {/* 하단 내비게이션 바 */}
      <nav className="bottom-nav">
        <div className="nav-icons">
          <div className="nav-icon">축제 기간&nbsp;&nbsp; 2024. 09. 01 ~ 10. 31</div> {/* 축제 기간 정보 표시 */}
        </div>
      </nav>
    </div>
  );

  return (
    // React Router를 사용하여 라우팅 설정
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로에 메인 콘텐츠 렌더링 */}
          <Route path="/" element={<MainContent />} />
          {/* 쿠폰 사용 페이지 경로 설정 */}
          <Route path="/use-coupon" element={<UseCouponPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // App 컴포넌트를 기본 내보내기
