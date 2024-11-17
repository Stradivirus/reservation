import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreRegistrationForm.css';

function PreRegistrationForm() {
  const API_URL = 'http://34.64.132.7:8082';
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!privacyConsent) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    if (phone.length !== 11) {
      alert('전화번호를 11자리로 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/preregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          privacy_consent: privacyConsent
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCouponCode(data.coupon_code);
        setIsRegistered(true);
        alert(`${data.message} 등록 시간: ${data.created_at}`);
      } else {
        const errorData = await response.json();
        alert(`오류: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error details:', error);
      alert(`사전 등록 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setPrivacyConsent(false);
    setCouponCode('');
    setIsRegistered(false);
  };

  const handleUseCoupon = () => {
    navigate(`/use-coupon?code=${couponCode}`);
  };

  const handleEnterCoupon = () => {
    navigate('/use-coupon');
  };

  if (isRegistered) {
    return (
      <div className="registration-success">
        <div className="success-inner">
          <h2>사전 등록이 완료되었습니다!</h2>
          <p>귀하의 쿠폰 코드: <strong>{couponCode}</strong></p>
          <p>이 코드를 안전한 곳에 보관해 주세요.</p>
          <div className="success-buttons">
            <button onClick={handleUseCoupon} className="primary-button">쿠폰 사용하기</button>
            <button onClick={resetForm} className="secondary-button">새로 등록하기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pre-registration-container">
      <div className="form-header">
        <h2>사전 등록하기</h2>
        <p>축제 소식을 가장 먼저 받아보세요!</p>
      </div>

      <form onSubmit={handleSubmit} className="pre-registration-form">
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력하세요"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="전화번호를 입력하세요 (숫자 11자리)"
            pattern="[0-9]{11}"
            required
          />
        </div>

        <div className="privacy-section">
          <div className="privacy-agreement">
            <input 
              type="checkbox" 
              id="privacyConsent" 
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              required 
            />
            <label htmlFor="privacyConsent">개인정보 수집 및 이용에 동의합니다.</label>
          </div>
          
          <div className="privacy-policy">
            <h4>개인정보 처리방침</h4>
            <div className="policy-content">
              <p>1. 수집하는 개인정보 항목: 이메일 주소, 전화번호</p>
              <p>2. 수집 및 이용목적: 축제 사전예약 및 관련 정보 안내</p>
              <p>3. 보유 및 이용기간: 축제 종료 시까지</p>
              <p>4. 동의를 거부할 권리: 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 거부 시 사전예약 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">사전등록 하기</button>
      </form>
      
      <div className="coupon-section">
        <p>이미 쿠폰이 있으신가요?</p>
        <button onClick={handleEnterCoupon} className="secondary-button">쿠폰 입력하기</button>
      </div>
    </div>
  );
}

export default PreRegistrationForm;