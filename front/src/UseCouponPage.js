import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UseCouponPage.css';

function UseCouponPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const couponCode = new URLSearchParams(location.search).get('code');

  const handleUseCoupon = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/use-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coupon_code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.detail || '쿠폰 사용 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setMessage('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="use-coupon-container">
      <div className="use-coupon-card">
        <h2 className="use-coupon-title">쿠폰 사용하기</h2>
        {couponCode ? (
          <>
            <div className="coupon-code-container">
              <p className="coupon-code-label">쿠폰 코드:</p>
              <p className="coupon-code">{couponCode}</p>
            </div>
            <button 
              className={`use-coupon-button ${isLoading ? 'loading' : ''}`} 
              onClick={handleUseCoupon} 
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '쿠폰 사용하기'}
            </button>
            {message && <p className={`message ${message.includes('성공') ? 'success' : 'error'}`}>{message}</p>}
          </>
        ) : (
          <p className="no-coupon-message">유효한 쿠폰 코드가 없습니다.</p>
        )}
        <button className="back-button" onClick={() => navigate('/')}>
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default UseCouponPage;