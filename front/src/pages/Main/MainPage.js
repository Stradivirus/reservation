import React from 'react';
import Header from '../../components/Header/Header';
import ImageSlider from './ImageSlider';
import PreRegistrationForm from './PreRegistrationForm';
import './MainPage.css';

function MainPage() {
  const handleAdminClick = () => {
    window.location.href = 'http://140.83.49.106:8001';
  };

  return (
    <div className="main-page">
      <Header />
      <main className="main-content">
        <section className="hero-section">
          <p className="festival-subtitle">푸른 잎이 꽃이 되는 가을<br></br>오색 찬란한 물결 속으로 <br></br>
            당신을 초대합니다</p>
          <div className="festival-period">2025. 09. 01 ~ 10. 30</div>
        </section>
        
        <section className="image-section">
          <ImageSlider />
        </section>
        
        <section className="registration-section">
          <PreRegistrationForm />
        </section>

        <section className="admin-section" style={{ textAlign: 'center', margin: '40px 0' }}>
          <button 
            onClick={handleAdminClick}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            관리자 페이지로 가기
          </button>
        </section>
      </main>
    </div>
  );
}

export default MainPage;