import React from 'react';
import Header from '../../components/Header/Header';
import ImageSlider from './ImageSlider';
import PreRegistrationForm from './PreRegistrationForm';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <main className="main-content">
        <section className="hero-section">
          <p className="festival-subtitle">모든 잎이 꽃이 되는 가을<br></br>오색 찬란한 물결 속으로 <br></br>
            당신을 초대합니다</p>
          <div className="festival-period">2025. 09. 01 ~ 10. 30</div>
        </section>
        
        <section className="image-section">
          <ImageSlider />
        </section>
        
        <section className="registration-section">
          <PreRegistrationForm />
        </section>
      </main>
    </div>
  );
}

export default MainPage;