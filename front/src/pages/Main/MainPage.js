import React from 'react';
import Header from '../../components/Header/Header';
import ImageSlider from './ImageSlider';
import ButtonSection from '../../components/ButtonSection/ButtonSection';
import PreRegistrationForm from './PreRegistrationForm';
import { Link } from 'react-router-dom'; // [수정] Link 컴포넌트 임포트
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />
      
      <div className="main-content">
        {/* 이미지 슬라이더 섹션 */}
        <section className="slider-section">
          <ImageSlider />
        </section>

        {/* 버튼 섹션 */}
        <section className="button-section">
          <ButtonSection />
        </section>

        {/* 사전예약 폼 섹션 */}
        <section id="pre-registration" className="form-section">
          <PreRegistrationForm />
        </section>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Stradivirus. All rights reserved.</p>
        <div className="admin-link">
          {/* [수정] 외부 링크(a tag) 대신 내부 라우팅(Link) 사용, 경로는 /admin */}
          <Link to="/admin" className="admin-link-text">
            관리자 페이지
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;