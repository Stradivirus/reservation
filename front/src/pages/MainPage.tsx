import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
  Search,
  Gift,
  Shield,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';
import PhotoGallerySlider from '../components/PhotoGallerySlider';
import TicketCardModal from '../components/TicketCardModal';
import {
  checkEmailDuplicate,
  checkPhoneDuplicate,
  lookupTicket,
  preregister,
} from '../api';
import { TicketInfo } from '../types';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
const PHONE_REGEX = /^\d{11}$/;

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup'>('register');

  // Pre-registration states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);

  const [emailStatus, setEmailStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  }>({ checked: false, valid: false, message: '' });

  const [phoneStatus, setPhoneStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  }>({ checked: false, valid: false, message: '' });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Ticket Lookup states
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Issued / Looked-up Ticket Modal
  const [modalTicket, setModalTicket] = useState<TicketInfo | null>(null);

  const handleEmailBlur = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailStatus({ checked: false, valid: false, message: '' });
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailStatus({
        checked: true,
        valid: false,
        message: '올바른 이메일 형식을 입력해주세요. (예: autumn@example.com)',
      });
      return;
    }
    try {
      const res = await checkEmailDuplicate(trimmed);
      setEmailStatus({
        checked: true,
        valid: res.ok,
        message: res.message,
      });
    } catch {
      setEmailStatus({
        checked: true,
        valid: false,
        message: '이메일 중복 확인 중 오류가 발생했습니다.',
      });
    }
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 11);
    setPhone(digitsOnly);
    setPhoneStatus({ checked: false, valid: false, message: '' });
  };

  const handlePhoneBlur = async () => {
    if (!phone) {
      setPhoneStatus({ checked: false, valid: false, message: '' });
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      setPhoneStatus({
        checked: true,
        valid: false,
        message: '전화번호는 하이픈(-) 없이 11자리 숫자로 입력해주세요.',
      });
      return;
    }
    try {
      const res = await checkPhoneDuplicate(phone);
      setPhoneStatus({
        checked: true,
        valid: res.ok,
        message: res.message,
      });
    } catch {
      setPhoneStatus({
        checked: true,
        valid: false,
        message: '전화번호 중복 확인 중 오류가 발생했습니다.',
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!PHONE_REGEX.test(phone)) {
      setFormError('전화번호는 11자리 숫자로 입력해주세요.');
      return;
    }
    if (!privacyConsent) {
      setFormError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const ticket = await preregister({
        email: trimmedEmail,
        phone,
        privacyConsent,
      });
      setModalTicket(ticket);
      setEmail('');
      setPhone('');
      setPrivacyConsent(false);
      setEmailStatus({ checked: false, valid: false, message: '' });
      setPhoneStatus({ checked: false, valid: false, message: '' });
    } catch (err: any) {
      setFormError(err.message || '사전예약 신청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    if (!lookupQuery.trim()) {
      setLookupError('등록하신 이메일, 전화번호 또는 8자리 추첨권 코드를 입력해주세요.');
      return;
    }

    setLookupLoading(true);
    try {
      const ticket = await lookupTicket(lookupQuery.trim());
      setModalTicket(ticket);
    } catch (err: any) {
      setLookupError(err.message || '일치하는 사전예약 내역을 찾을 수 없습니다.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pb-20">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden border-b border-stone-800/70 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>2026 AUTUMN BLOSSOM FESTIVAL · 사전예약 오픈</span>
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              푸른 잎이 꽃이 되는 가을,{' '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                오색 찬란한 물결 속으로
              </span>{' '}
              당신을 초대합니다
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-stone-300 sm:text-base">
              지금 사전예약을 완료하시면 현장 즉시 입장이 가능한{' '}
              <strong className="text-amber-300">모바일 QR 패스</strong>와 함께{' '}
              <strong className="text-amber-300">100% 당첨 럭키드로우 추첨권</strong>을 즉시 발급해 드립니다.
            </p>

            {/* Festival Period & Info Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/90 px-4 py-2 text-stone-200">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span className="font-semibold">축제 기간:</span>
                <span className="text-amber-300 font-bold">2026. 09. 01 ~ 10. 30</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/90 px-4 py-2 text-stone-200">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>가을 꽃 축제 생태공원 메인 가든</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/90 px-4 py-2 text-stone-200">
                <Clock className="h-4 w-4 text-rose-400" />
                <span>운영 시간: 09:00 - 21:00 (야간 라이트업)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Content */}
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: 5 Original Photos Slider + Lucky Draw Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <PhotoGallerySlider />

            {/* Prize Preview Banner */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    100% Winning Lucky Draw
                  </span>
                  <h2 className="mt-0.5 text-lg font-bold text-white">
                    사전예약자 전원 경품 추첨권 즉시 지급
                  </h2>
                </div>
                <Link
                  to="/use-coupon"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
                >
                  <span>추첨 페이지 바로가기</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                  <div className="text-lg">🏆</div>
                  <div className="mt-1 text-xs font-bold text-amber-300">1등 (5%)</div>
                  <div className="mt-0.5 text-xs font-semibold text-stone-100">
                    VIP 라운지 2인 패스
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-3.5">
                  <div className="text-lg">🎁</div>
                  <div className="mt-1 text-xs font-bold text-orange-300">2등 (15%)</div>
                  <div className="mt-0.5 text-xs font-semibold text-stone-100">
                    한정판 축제 굿즈 패키지
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-3.5">
                  <div className="text-lg">🍔</div>
                  <div className="mt-1 text-xs font-bold text-rose-300">3등 (30%)</div>
                  <div className="mt-0.5 text-xs font-semibold text-stone-100">
                    푸드트럭 10,000원권
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-3.5">
                  <div className="text-lg">☕</div>
                  <div className="mt-1 text-xs font-bold text-emerald-300">4등 (50%)</div>
                  <div className="mt-0.5 text-xs font-semibold text-stone-100">
                    현장 웰컴 드링크 교환권
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form & Ticket Re-lookup Card */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/80 shadow-2xl">
              {/* Mode Switch Tabs */}
              <div className="grid grid-cols-2 border-b border-stone-800 bg-stone-950/60 p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Ticket className="h-4 w-4" />
                  <span>사전예약 신청</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('lookup')}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                    activeTab === 'lookup'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>내 QR 티켓 조회</span>
                </button>
              </div>

              {activeTab === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      가을 꽃 축제 사전예약 등록
                    </h2>
                    <p className="mt-1 text-xs text-stone-400">
                      이메일과 연락처를 입력하시면 모바일 QR 입장권과 8자리 추첨 코드가 즉시 발급됩니다.
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300">
                      이메일 주소 <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailStatus({ checked: false, valid: false, message: '' });
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="autumn@example.com"
                      required
                      className="mt-1.5 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    />
                    {emailStatus.checked && (
                      <p
                        className={`mt-1.5 flex items-center gap-1.5 text-xs ${
                          emailStatus.valid ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {emailStatus.valid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span>{emailStatus.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300">
                      휴대폰 번호 (숫자 11자리) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={handlePhoneBlur}
                      placeholder="01012345678"
                      maxLength={11}
                      required
                      className="mt-1.5 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    />
                    {phoneStatus.checked && (
                      <p
                        className={`mt-1.5 flex items-center gap-1.5 text-xs ${
                          phoneStatus.valid ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {phoneStatus.valid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span>{phoneStatus.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Privacy Consent */}
                  <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-stone-200">
                        <input
                          type="checkbox"
                          checked={privacyConsent}
                          onChange={(e) => setPrivacyConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-stone-600 bg-stone-900 text-amber-500 focus:ring-amber-500"
                        />
                        <span>
                          <strong className="text-amber-300">[필수]</strong> 개인정보 수집 및 이용 동의
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyDetail((prev) => !prev)}
                        className="text-xs font-medium text-stone-400 underline hover:text-amber-300"
                      >
                        {showPrivacyDetail ? '접기' : '약관 보기'}
                      </button>
                    </div>

                    {showPrivacyDetail && (
                      <div className="mt-3 space-y-1.5 border-t border-stone-800 pt-3 text-[11px] leading-relaxed text-stone-400">
                        <p>• 수집 항목: 이메일 주소, 휴대전화 번호</p>
                        <p>• 수집 목적: 2026 가을 꽃 축제 사전예약 본인 확인, 모바일 QR 티켓 및 경품 추첨권 발급</p>
                        <p>• 보유 기간: 축제 종료 후 30일 이내 지체 없이 파기</p>
                      </div>
                    )}
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-4 text-sm font-extrabold text-stone-950 shadow-lg shadow-amber-500/25 transition hover:brightness-110 disabled:opacity-50"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>
                      {submitting ? 'QR 티켓 발급 중...' : '사전예약 완료하고 QR 티켓 받기'}
                    </span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLookupSubmit} className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      내 모바일 QR 티켓 다시 조회
                    </h2>
                    <p className="mt-1 text-xs text-stone-400">
                      이미 사전예약을 완료하셨나요? 등록하신 이메일, 전화번호 또는 8자리 쿠폰 코드를 입력하면 QR 티켓과 추첨 결과를 다시 확인할 수 있습니다.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300">
                      이메일 / 전화번호 / 추첨권 코드
                    </label>
                    <input
                      type="text"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      placeholder="예: autumn@example.com 또는 01012345678"
                      className="mt-1.5 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  {lookupError && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{lookupError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-sm font-extrabold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-50"
                  >
                    <Search className="h-4 w-4" />
                    <span>{lookupLoading ? '티켓 조회 중...' : '내 QR 입장권 & 추첨 코드 불러오기'}</span>
                  </button>

                  <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4 text-xs text-stone-400 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-300">
                      <Shield className="h-3.5 w-3.5 text-amber-400" />
                      <span>안내사항</span>
                    </div>
                    <p>• 개인정보 보호를 위해 티켓 화면에서는 이메일과 연락처 일부가 마스킹 표시됩니다.</p>
                    <p>• 발급된 8자리 코드는 <Link to="/use-coupon" className="text-amber-300 underline">추첨권 사용</Link> 메뉴에서 경품 뽑기에 사용할 수 있습니다.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mobile QR Pass Modal */}
      <TicketCardModal ticket={modalTicket} onClose={() => setModalTicket(null)} />
    </div>
  );
};

export default MainPage;
