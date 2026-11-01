import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Award,
  Calendar,
  CheckCircle2,
  Gift,
  Receipt,
  Sparkles,
  Ticket,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useCouponApi } from '../api';
import { CouponResult } from '../types';

const PRIZE_TIERS = [
  {
    rank: 1,
    probability: '5%',
    icon: '🏆',
    title: '가을 꽃 축제 VIP 라운지 2인 패스',
    desc: '프라이빗 테라스 좌석 + 스페셜 다과 세트 제공',
    badgeClass: 'border-amber-400/50 bg-amber-500/15 text-amber-300',
  },
  {
    rank: 2,
    probability: '15%',
    icon: '🎁',
    title: '한정판 가을 꽃 축제 굿즈 패키지',
    desc: '가을 에디션 에코백 + 플라워 디퓨저 + 엽서 세트',
    badgeClass: 'border-orange-400/50 bg-orange-500/15 text-orange-300',
  },
  {
    rank: 3,
    probability: '30%',
    icon: '🍔',
    title: '축제 푸드트럭 10,000원 이용권',
    desc: '축제장 내 전 푸드트럭 부스에서 현금처럼 사용 가능',
    badgeClass: 'border-rose-400/50 bg-rose-500/15 text-rose-300',
  },
  {
    rank: 4,
    probability: '50%',
    icon: '☕',
    title: '현장 웰컴 드링크 교환권',
    desc: '가을 시그니처 꽃차 또는 아메리카노 1잔 즉시 교환',
    badgeClass: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300',
  },
];

const UseCouponPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [couponCode, setCouponCode] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [highlightRank, setHighlightRank] = useState<number | null>(null);
  const [result, setResult] = useState<CouponResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setCouponCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleDrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const normalized = couponCode.trim().toUpperCase();
    if (normalized.length !== 8) {
      setError('8자리 추첨권 코드를 정확히 입력해주세요.');
      return;
    }

    setIsDrawing(true);

    // Roulette slot highlight animation while waiting
    let step = 0;
    const spinInterval = setInterval(() => {
      setHighlightRank((step % 4) + 1);
      step += 1;
    }, 140);

    try {
      const apiPromise = useCouponApi(normalized);
      const [res] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 1250)),
      ]);

      clearInterval(spinInterval);
      setHighlightRank(res.prizeRank ?? 4);
      setResult(res);
    } catch (err: any) {
      clearInterval(spinInterval);
      setHighlightRank(null);
      setError(err.message || '추첨 처리 중 오류가 발생했습니다.');
    } finally {
      setIsDrawing(false);
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const matchedTier = PRIZE_TIERS.find((t) => t.rank === (result?.prizeRank ?? 4)) || PRIZE_TIERS[3];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Gift className="h-3.5 w-3.5" />
            100% WINNING LUCKY DRAW
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            실시간 경품 럭키드로우 추첨소
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            사전예약 시 발급받은 8자리 추첨권 코드를 입력하고 1등~4등 경품을 즉시 뽑아보세요!
          </p>
        </div>

        {/* 4 Prize Tiers Roulette Grid */}
        <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {PRIZE_TIERS.map((tier) => {
            const isHighlighted = highlightRank === tier.rank;
            return (
              <div
                key={tier.rank}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
                  isHighlighted
                    ? 'scale-[1.02] border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
                    : 'border-stone-800 bg-stone-900/75'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-2xl shadow-inner">
                    {tier.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${tier.badgeClass}`}
                      >
                        {tier.rank}등 · 당첨확률 {tier.probability}
                      </span>
                      {isHighlighted && (
                        <span className="text-xs font-bold text-amber-300 animate-pulse">
                          ★ SELECTED
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold text-white">{tier.title}</h3>
                    <p className="mt-0.5 text-xs text-stone-400">{tier.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code Input Box */}
        <div className="mt-8 rounded-3xl border border-stone-800 bg-stone-900/85 p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleDrawSubmit} className="space-y-4">
            <label className="block text-center text-sm font-bold text-stone-200">
              사전예약 8자리 추첨권 코드 입력
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                maxLength={8}
                placeholder="8자리 영문/숫자 코드 (예: AB12CD34)"
                className="flex-1 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-center font-mono text-xl font-black tracking-[0.25em] text-amber-400 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-stone-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
              <button
                type="submit"
                disabled={isDrawing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-4 text-base font-extrabold text-stone-950 shadow-lg shadow-amber-500/25 transition hover:brightness-110 disabled:opacity-60"
              >
                <Sparkles className={`h-5 w-5 ${isDrawing ? 'animate-spin' : ''}`} />
                <span>{isDrawing ? '행운의 경품 추첨 중...' : '럭키드로우 뽑기!'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Display: Either Fresh Win OR Already Used Receipt Card */}
          {result && (
            <div className="mt-7 overflow-hidden rounded-3xl border border-amber-500/40 bg-stone-950 shadow-xl">
              {result.alreadyUsed ? (
                /* 이미 사용된 코드: 당첨 영수증 카드 */
                <div>
                  <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900/90 px-6 py-4">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Receipt className="h-5 w-5" />
                      <span className="text-sm font-bold">
                        이미 추첨이 완료된 코드입니다 (당첨 영수증 조회)
                      </span>
                    </div>
                    <span className="rounded-full bg-stone-800 px-3 py-1 font-mono text-xs font-semibold text-stone-300">
                      #{result.couponCode}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10 text-4xl">
                        {matchedTier.icon}
                      </div>
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          당첨 확정 완료 · {result.prizeRank}등 경품
                        </span>
                        <h3 className="mt-2 text-2xl font-extrabold text-white">
                          {result.prizeName}
                        </h3>
                        <p className="mt-1 text-xs text-stone-400">
                          본 영수증 화면을 축제 현장 경품 수령 부스에 제시해 주세요.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                      <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3">
                        <span className="text-stone-400">추첨 완료 일시</span>
                        <p className="mt-1 font-semibold text-stone-200">
                          {formatDateTime(result.usedAt)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3">
                        <span className="text-stone-400">예약자 이메일</span>
                        <p className="mt-1 font-semibold text-stone-200">
                          {result.maskedEmail || '-'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3">
                        <span className="text-stone-400">예약자 연락처</span>
                        <p className="mt-1 font-semibold text-stone-200">
                          {result.maskedPhone || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 최초 추첨 성공: 당첨 축하 카드 */
                <div>
                  <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-4 text-stone-950 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm">
                      <Award className="h-5 w-5" />
                      <span>CONGRATULATIONS! 실시간 추첨 결과 발표</span>
                    </div>
                    <span className="rounded-full bg-stone-950/20 px-3 py-0.5 font-mono text-xs font-bold text-white">
                      #{result.couponCode}
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/40 bg-amber-500/15 text-5xl shadow-lg shadow-amber-500/20">
                      {matchedTier.icon}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1 text-sm font-extrabold text-amber-300">
                      🎉 {result.prizeRank}등 경품 당첨!
                    </div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
                      {result.prizeName}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-stone-300">
                      {matchedTier.desc}
                    </p>

                    <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-stone-800 bg-stone-900/80 px-5 py-3 text-xs text-stone-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                        추첨 일시: <strong>{formatDateTime(result.usedAt)}</strong>
                      </span>
                      {result.maskedPhone && (
                        <span>
                          예약자: <strong>{result.maskedPhone}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-5 text-xs text-stone-400">
            <span>아직 사전예약 코드가 없으신가요?</span>
            <div className="flex items-center gap-3">
              {result && (
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setCouponCode('');
                    setHighlightRank(null);
                  }}
                  className="inline-flex items-center gap-1 text-stone-300 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>다른 코드 입력</span>
                </button>
              )}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>사전예약 및 내 QR 티켓 조회하기 →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCouponPage;
