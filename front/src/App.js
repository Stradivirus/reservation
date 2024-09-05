import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PreRegistrationForm from './PreRegistrationForm';
import UseCouponPage from './UseCouponPage';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 6;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const MainContent = () => (
    <div className="content">
      <h1 className="title">사전등록</h1>
      <div className="main-content">
        <div className="left-content">
          <div className="image-slider-container">
            <div 
              className="image-slider" 
              style={{ transform: `translateX(-${currentImageIndex * (100 / 3)}%)` }}
            >
              {[1, 2, 3, 4, 5, 6, 1, 2].map((num, index) => (
                <div key={index} className="image-wrapper">
                  <img 
                    src={`${process.env.PUBLIC_URL}/unnamed${num}.webp`} 
                    alt={`게임 캐릭터 ${num}`} 
                    className="character-image" 
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="game-introduction">
            <h2>게임 소개</h2>
            <p>또 다른 시작, 숨겨진 역사의 비밀 심연의 마물들로부터 마지막 도시 칼리를 지켜주세요.</p>
            <h3>[ 게임 소개 ]</h3>
            <p>◈ 잊혀진 기억, 또 다른 시간대에 펼쳐지는 스토리<br />
            평화로운 도시 칼리를 침략한 미지의 적, 그리고 이 시대 마지막 악마 헌터 당신.<br />
            로블리어를 구원하고 숨겨진 비밀을 풀어나가세요!</p>
            <h3>[게임 특징]</h3>
            <p>◈ 화려한 액션의 핵 앤 슬래시 방치형 RPG<br />
            심플하고, 스피드하게 진행되는 전투방식<br />
            화면을 가득 채우는 마물을 압도적인 액션으로 무찔러 보세요.</p>
            <p>◈ 전투 상황에 따라 변경 가능한 직업과 스킬 설정<br />
            내 마음대로 선택가능한 직업과 스킬!<br />
            높은 자유도를 통해 내마음대로 육성하세요.</p>
            <p>◈ 압도적인 콘텐츠와 지속적인 성장 지원<br />
            50개이상의 던전과 각종 지원 보상!<br />
            밀려오는 콘텐츠의 파도를 대비하세요.</p>
            <p>◈ 무한 성장이 가능한 방치형 시스템<br />
            쉽고 빠르게! 초스피드 무한 성장!<br />
            오프라인 방치만으로도 성장하는 경험치와 보상</p>
            <p>◈ 일일 임무만 해도 육성 가능한 착한 게임<br />
            지금 바로 시작하세요!</p>
          </div>
        </div>
        <div className="right-content">
          <div className="top-section">
            <img src={process.env.PUBLIC_URL + '/Demonhenter.png'} alt="새 캐릭터 이미지" className="new-character-image" />
            <div className="company-info">
              <h2>회사 소개</h2>
              <p>Handy communications</p>
            </div>
          </div>
          <PreRegistrationForm />
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div 
        className="App" 
        style={{backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`}}
      >
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/use-coupon" element={<UseCouponPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;