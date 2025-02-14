import React from 'react';
import Header from '../../components/Header/Header';
import ButtonSection from '../../components/ButtonSection/ButtonSection';
import ImageSlider from './ImageSlider';

function MainPage() {
  return (
    <div className="festival-container">
      <Header />

      <div className="main-content">
        <div className="left-section">
          <div className="title-section">
            <h1 className="festival-name">2025 하늘공원 축제</h1>
            <ImageSlider />
            <h2 className="main-title">
              <span className="title-line">모든 잎이 꽃이 되는 가을</span>
              <span className="title-line">오색 찬란한 물결 속으로 당신을 초대합니다<br></br></span>
            </h2>
          </div>
        </div>

        <div className="right-section">
          <ButtonSection />
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-icons">
          <div className="nav-icon">축제 기간&nbsp;&nbsp; 2025. 09. 01 ~ 10. 30</div>
        </div>
      </nav>
    </div>
  );
}

export default MainPage;