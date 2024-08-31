import React, { useState } from 'react';
import './PreRegistrationForm.css'; // 새로운 CSS 파일을 import합니다.

function PreRegistrationForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!privacyConsent) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    console.log('사전 등록:', { email, phone, privacyConsent });
    setEmail('');
    setPhone('');
    setPrivacyConsent(false);
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
        onChange={(e) => setPhone(e.target.value)}
        placeholder="전화번호를 입력하세요"
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