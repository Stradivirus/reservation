import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmailDuplicate, checkPhoneDuplicate, preregister } from '../../api';
import { PreRegistrationDto } from '../../dto/PreRegistrationDto';
import './PreRegistrationForm.css';

function PreRegistrationForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 11) {
      setPhone(value);
      setPhoneError('');
    }
  };

  const checkEmailDuplicateHandler = async () => {
    if (!email) return;
    try {
      const response = await checkEmailDuplicate(email);
      if (!response.ok) {
        const errorData = await response.json();
        setEmailError(errorData.detail || '이미 등록된 이메일 주소입니다.');
      }
    } catch (error) {
      setEmailError('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const checkPhoneDuplicateHandler = async () => {
    if (phone.length !== 11) return;
    try {
      const response = await checkPhoneDuplicate(phone);
      if (!response.ok) {
        const errorData = await response.json();
        setPhoneError(errorData.detail || '이미 등록된 전화번호입니다.');
      }
    } catch (error) {
      setPhoneError('전화번호 중복 확인 중 오류가 발생했습니다.');
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

    await checkEmailDuplicateHandler();
    await checkPhoneDuplicateHandler();
    if (emailError || phoneError) {
      return;
    }

    try {
      const dto = new PreRegistrationDto(email, phone, privacyConsent);
      const response = await preregister(dto);
      if (response.ok) {
        const data = await response.json();
        setCouponCode(data.coupon_code);
        setIsRegistered(true);
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
    setEmailError('');
    setPhoneError('');
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
          <p>귀하의 추첨권 코드: <strong>{couponCode}</strong></p>
          <p>이 코드를 안전한 곳에 보관해 주세요.</p>
          <div className="success-buttons">
            <button onClick={handleUseCoupon} className="primary-button">추첨권 사용하기</button>
            <button onClick={resetForm} className="secondary-button">새로 등록하기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pre-registration-container">
      <div className="form-header">
        <p>축제 소식을 가장 먼저 받아보세요!</p>
      </div>

      <form onSubmit={handleSubmit} className="pre-registration-form">
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={checkEmailDuplicateHandler}
            placeholder="이메일 주소를 입력하세요"
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        <div className="input-group">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={checkPhoneDuplicateHandler}
            placeholder="전화번호를 입력하세요 (숫자 11자리)"
            pattern="[0-9]{11}"
            required
          />
          {phoneError && <p className="error-message">{phoneError}</p>}
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
        <p>이미 추첨권이 있으신가요?</p>
        <button onClick={handleEnterCoupon} className="secondary-button">추첨권 입력하기</button>
      </div>
    </div>
  );
}

export default PreRegistrationForm;