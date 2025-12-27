import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // [추가] 링크 사용을 위해 임포트
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">하늘공원 축제</div>
        
        {/* [추가] Admin 버튼 (스타일은 상황에 맞게 조정 가능) */}
        <Link 
          to="/admin" 
          style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            fontWeight: 'bold', 
            marginRight: '15px',
            fontSize: '14px'
          }}
        >
          Admin
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
      </div>
    </header>
  );
};

export default Header;