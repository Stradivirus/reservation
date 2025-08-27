import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">하늘공원 축제</div>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollToSection('about')}>소개</button>
          <button onClick={() => scrollToSection('events')}>행사</button>
          <button onClick={() => scrollToSection('location')}>오시는 길</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;