// ButtonSection.js
import React, { useState } from 'react';
import PreRegistrationForm from '../../PreRegistrationForm';
import './ButtonSection.css';

const ButtonSection = () => {
  const [activeContent, setActiveContent] = useState(null);

  const toggleContent = (content) => {
    if (activeContent === content) {
      setActiveContent(null);
    } else {
      setActiveContent(content);
    }
  };

  return (
    <div className="button-section">
      <div className="content-wrapper">
        <div className="buttons-container">
          <button 
            className={`section-button ${activeContent === 'info' ? 'active' : ''}`}
            onClick={() => toggleContent('info')}
          >
            축제 소개
          </button>
          <button 
            className={`section-button ${activeContent === 'registration' ? 'active' : ''}`}
            onClick={() => toggleContent('registration')}
          >
            사전 등록
          </button>
          <button 
            className={`section-button ${activeContent === 'events' ? 'active' : ''}`}
            onClick={() => toggleContent('events')}
          >
            주요 행사
          </button>
        </div>

        {activeContent === 'info' && (
          <div className="section-content info-content">
            <h3>축제 소개</h3>
            <p>&nbsp;&nbsp;올해로 다섯 번째를 맞이하는 <br></br>하늘공원 축제는 <br></br>'가을'과 '꽃'이라는 테마 아래, <br></br>바쁜 일상 속 자연에서 여유를 찾고자 <br></br>만들어진 축제입니다.<br></br>&nbsp;&nbsp;깊어가는 가을, 사랑하는 사람과 함께 <br></br>노을빛 물든 자연에 흠뻑 취해보세요. </p>
          </div>
        )}
        
        {activeContent === 'registration' && (
          <div className="section-content registration-content">
            <PreRegistrationForm />
          </div>
        )}
        
        {activeContent === 'events' && (
          <div className="section-content events-content">
            <h3>주요 행사</h3>
            <ul>
              <li>가을 음악회</li>
              <li>꽃차 시음회</li>
              <li>소원등 만들기</li>
              <li>생화 책갈피 만들기</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonSection;