import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  Copy,
  Gift,
  Sparkles,
  Ticket,
  X,
  Calendar,
  Mail,
  Phone,
  Award,
} from 'lucide-react';
import { TicketInfo } from '../types';

interface TicketCardModalProps {
  ticket: TicketInfo | null;
  onClose: () => void;
}

const TicketCardModal: React.FC<TicketCardModalProps> = ({ ticket, onClose }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!ticket) return null;

  const code = ticket.couponCode || ticket.coupon_code;
  const qrUrl = `${window.location.origin}/use-coupon?code=${encodeURIComponent(code)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToLuckyDraw = () => {
    onClose();
    navigate(`/use-coupon?code=${encodeURIComponent(code)}`);
  };

  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '2026 가을 시즌';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-900 shadow-2xl shadow-amber-950/50">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/30 p-2 text-stone-200 transition hover:bg-black/60 hover:text-white"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Ticket Top Header */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 px-6 pb-6 pt-7 text-stone-950">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <Ticket className="h-3.5 w-3.5" />
            2026 Autumn Flower Festival Pass
          </div>
          <h3 className="mt-2.5 text-2xl font-extrabold tracking-tight text-white">
            모바일 사전예약 QR 입장권
          </h3>
          <p className="mt-1 text-xs font-medium text-amber-100">
            현장 입장 및 100% 당첨 럭키드로우 추첨에 사용되는 공식 모바일 패스입니다.
          </p>
        </div>

        {/* QR & Attendee Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-950/90 p-5">
            <div className="rounded-2xl bg-white p-3.5 shadow-inner">
              <QRCodeSVG value={qrUrl} size={148} level="M" includeMargin={false} />
            </div>
            <p className="mt-2.5 text-xs text-stone-400">
              QR 스캔 시 추첨 페이지로 자동 연결됩니다
            </p>
          </div>

          {/* Masked User Info */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-xl border border-stone-800/90 bg-stone-950/60 p-3">
              <div className="flex items-center gap-1.5 text-stone-400">
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>예약자 이메일</span>
              </div>
              <p className="mt-1 truncate font-semibold text-stone-200">
                {ticket.maskedEmail || ticket.email || '-'}
              </p>
            </div>
            <div className="rounded-xl border border-stone-800/90 bg-stone-950/60 p-3">
              <div className="flex items-center gap-1.5 text-stone-400">
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <span>연락처</span>
              </div>
              <p className="mt-1 font-semibold text-stone-200">
                {ticket.maskedPhone || ticket.phone || '-'}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between rounded-xl border border-stone-800/90 bg-stone-950/60 px-3.5 py-2.5 text-xs">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              발급 일시
            </span>
            <span className="font-medium text-stone-300">{formattedDate}</span>
          </div>
        </div>

        {/* Perforated Cut Line (절취선) */}
        <div className="relative flex items-center justify-between py-2">
          <div className="-ml-3 h-6 w-6 rounded-full bg-black/85 border-r border-amber-500/30" />
          <div className="w-full border-t-2 border-dashed border-stone-700 mx-2" />
          <div className="-mr-3 h-6 w-6 rounded-full bg-black/85 border-l border-amber-500/30" />
        </div>

        {/* Bottom Coupon Code & Action */}
        <div className="px-6 pb-6 pt-2">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  Lucky Draw 8-Digit Code
                </span>
                <div className="mt-0.5 font-mono text-2xl font-black tracking-widest text-amber-400">
                  {code}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-stone-900/90 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-stone-950"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>코드 복사</span>
                  </>
                )}
              </button>
            </div>

            {ticket.isCouponUsed ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-950/80 px-3.5 py-2.5 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Award className="h-4 w-4" />
                  추첨 완료: {ticket.prizeRank}등 ({ticket.prizeName})
                </span>
                <button
                  type="button"
                  onClick={handleGoToLuckyDraw}
                  className="text-amber-300 underline hover:text-amber-200"
                >
                  영수증 보기
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-stone-300">
                ✨ 아직 사용하지 않은 추첨권입니다. 지금 바로 경품을 뽑아보세요!
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={handleGoToLuckyDraw}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-orange-400"
            >
              <Gift className="h-4 w-4" />
              <span>{ticket.isCouponUsed ? '당첨 영수증 확인하기' : '지금 바로 추첨권 사용하기'}</span>
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-stone-700 bg-stone-800 px-4 py-3.5 text-sm font-semibold text-stone-300 transition hover:bg-stone-700"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCardModal;
