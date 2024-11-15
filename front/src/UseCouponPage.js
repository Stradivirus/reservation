import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UseCouponPage.css';

function UseCouponPage() {
  // 페이지 이동과 URL 매개변수 접근을 위한 React Router 훅
  const location = useLocation();
  const navigate = useNavigate();

  // 상태 변수들
  const [message, setMessage] = useState(''); // 사용자에게 메시지 표시용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 처리용
  const [inputCouponCode, setInputCouponCode] = useState(''); // 수동 쿠폰 코드 입력용

  // URL 매개변수에서 쿠폰 코드 추출
  const couponCode = new URLSearchParams(location.search).get('code');

  // 쿠폰 사용 처리 함수
  const handleUseCoupon = async () => {
    const codeToUse = couponCode || inputCouponCode;
    if (!codeToUse) {
      setMessage('쿠폰 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 쿠폰 사용을 위한 API 호출
      const response = await fetch('http://34.64.132.7:8082/api/use-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coupon_code: codeToUse }),
      });

      const data = await response.json();

      // API 응답 처리
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
          // URL에 제공된 쿠폰 코드 표시
          <div className="coupon-code-container">
            <p className="coupon-code-label">쿠폰 코드:</p>
            <p className="coupon-code">{couponCode}</p>
          </div>
        ) : (
          // 수동 쿠폰 코드 입력 필드
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
        {/* 쿠폰 사용 트리거 버튼 */}
        <button 
          className={`use-coupon-button ${isLoading ? 'loading' : ''}`} 
          onClick={handleUseCoupon} 
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '쿠폰 사용하기'}
        </button>
        {/* 성공 또는 오류 메시지 표시 */}
        {message && <p className={`message ${message.includes('성공') ? 'success' : 'error'}`}>{message}</p>}
        {/* 메인 페이지로 돌아가는 네비게이션 버튼 */}
        <button className="back-button" onClick={() => navigate('/')}>
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default UseCouponPage;