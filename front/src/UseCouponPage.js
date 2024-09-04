import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UseCouponPage.css';

function UseCouponPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 새로 추가된 상태
  const [inputCouponCode, setInputCouponCode] = useState('');
  const couponCode = new URLSearchParams(location.search).get('code');

  const handleUseCoupon = async () => {
    // 수정된 부분: URL의 쿠폰 코드 또는 입력된 쿠폰 코드 사용
    const codeToUse = couponCode || inputCouponCode;
    if (!codeToUse) {
      setMessage('쿠폰 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/use-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coupon_code: codeToUse }),
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
          <div className="coupon-code-container">
            <p className="coupon-code-label">쿠폰 코드:</p>
            <p className="coupon-code">{couponCode}</p>
          </div>
        ) : (
          // 새로 추가된 부분: 쿠폰 코드 입력 필드
          <div className="coupon-input-container">
            <input
              type="text"
              value={inputCouponCode}
              onChange={(e) => setInputCouponCode(e.target.value)}
              placeholder="쿠폰 코드를 입력하세요"
              className="coupon-input"
            />
          </div>
        )}
        <button 
          className={`use-coupon-button ${isLoading ? 'loading' : ''}`} 
          onClick={handleUseCoupon} 
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '쿠폰 사용하기'}
        </button>
        {message && <p className={`message ${message.includes('성공') ? 'success' : 'error'}`}>{message}</p>}
        <button className="back-button" onClick={() => navigate('/')}>
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default UseCouponPage;