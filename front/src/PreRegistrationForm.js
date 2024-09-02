import React, { useState } from 'react';
import './PreRegistrationForm.css';

// 실제 서버 주소로 변경하세요
const API_URL = 'http://218.156.126.186:8000';

function PreRegistrationForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

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
        body: JSON.stringify({ email, phone, privacy_consent: privacyConsent }),
      });

      if (response.ok) {
        const data = await response.json();
	alert(`${data.message} 등록 시간: ${data.created_at}`);
        setEmail('');
        setPhone('');
        setPrivacyConsent(false);
      } else {
        const errorData = await response.json();
        alert(`오류: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error details:', error);
      alert(`사전 등록 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pre-registration-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소를 입력하세요"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="전화번호를 입력하세요 (숫자 11자리)"
        pattern="[0-9]{11}"
        required
      />
      <button type="submit">사전등록</button>
      
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
        <p>
          1. 수집하는 개인정보 항목: 이메일 주소, 전화번호
          <br />
          2. 수집 및 이용목적: 게임 사전예약 및 관련 정보 안내
          <br />
          3. 보유 및 이용기간: 사전예약 서비스 종료 시까지
          <br />
          4. 동의를 거부할 권리: 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 
             거부 시 사전예약 서비스 이용이 제한될 수 있습니다.
        </p>
      </div>
    </form>
  );
}

export default PreRegistrationForm;
