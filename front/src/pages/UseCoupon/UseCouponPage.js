import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postCoupon } from '../../api';
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
  let couponCode = new URLSearchParams(location.search).get('code');
  if (couponCode === 'undefined' || couponCode === null) {
    couponCode = '';
  }

  // inputCouponCode를 URL code로 초기화 (최초 렌더링 시 한 번만)
  React.useEffect(() => {
    if (couponCode) {
      setInputCouponCode(couponCode);
    }
  }, [couponCode]);

  // 쿠폰 사용 처리 함수
  const handleUseCoupon = async () => {
    const codeToUse = inputCouponCode;
    if (!codeToUse) {
      setMessage('코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // api.js의 postCoupon 함수 사용
      const response = await postCoupon(codeToUse);
      const data = await response.json();

      // API 응답 처리
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.detail || '추첨권 사용 중 오류가 발생했습니다.');
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
        <h2 className="use-coupon-title">추첨권 사용하기</h2>
        {couponCode ? (
          // URL에 제공된 쿠폰 코드 표시
          <div className="coupon-code-container">
            <p className="coupon-code-label">추첨권 코드:</p>
            <p className="coupon-code">{couponCode}</p>
          </div>
        ) : (
          /*
            수동 쿠폰 코드 입력 필드: 항상 입력창을 보여주고, URL code가 있으면 자동 입력
          */
          <div className="coupon-input-container">
            <input
              type="text"
              value={inputCouponCode}
              onChange={(e) => setInputCouponCode(e.target.value)}
              placeholder="추첨권 코드를 입력하세요"
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
          {isLoading ? '처리 중...' : '추첨권 사용하기'}
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