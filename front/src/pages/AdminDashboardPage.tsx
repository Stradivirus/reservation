import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  LogOut,
  PieChart,
  RefreshCw,
  Search,
  Ticket,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { getAdminRegistrations } from '../api';
import {
  AdminStats,
  DateCountItem,
  PrizeStatItem,
  RegistrationItem,
} from '../types';

const RANK_COLORS: Record<
  number,
  { stroke: string; badge: string; dot: string; label: string }
> = {
  1: {
    stroke: '#f59e0b',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    label: '🏆 1등 VIP 패스',
  },
  2: {
    stroke: '#f97316',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    dot: 'bg-orange-400',
    label: '🎁 2등 굿즈 패키지',
  },
  3: {
    stroke: '#f43f5e',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    label: '🍔 3등 푸드트럭권',
  },
  4: {
    stroke: '#10b981',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: '☕ 4등 웰컴 드링크',
  },
};

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter & Pagination states
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [prizeRankFilter, setPrizeRankFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Data states
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    today: 0,
    usedCouponCount: 0,
    unusedCouponCount: 0,
    usageRate: 0,
  });
  const [dateCounts, setDateCounts] = useState<DateCountItem[]>([]);
  const [prizeStats, setPrizeStats] = useState<PrizeStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminRegistrations({
        page,
        size: 20,
        date: dateFilter,
        usage: usageFilter,
        prizeRank: prizeRankFilter,
        search: appliedSearch,
      });
      setItems(data.content || []);
      setTotalPages(Math.max(1, data.totalPages || 1));
      setTotalElements(data.totalElements || 0);
      if (data.stats) {
        setStats(data.stats);
      }
      setDateCounts(data.dateCounts || []);
      setPrizeStats(data.prizeStats || []);
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, dateFilter, usageFilter, prizeRankFilter, appliedSearch]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleResetFilters = () => {
    setDateFilter('all');
    setUsageFilter('all');
    setPrizeRankFilter('all');
    setSearchInput('');
    setAppliedSearch('');
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  // Sort daily counts chronologically for bar chart (latest 7 days)
  const chartDates = useMemo(() => {
    return [...dateCounts]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [dateCounts]);

  const maxDateCount = useMemo(() => {
    return Math.max(1, ...chartDates.map((d) => Number(d.count) || 0));
  }, [chartDates]);

  const totalPrizeDrawn = useMemo(() => {
    return prizeStats.reduce((sum, p) => sum + (Number(p.count) || 0), 0);
  }, [prizeStats]);

  // SVG Donut segments calculation
  const donutSegments = useMemo(() => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return prizeStats.map((item) => {
      const count = Number(item.count) || 0;
      const pct = totalPrizeDrawn > 0 ? count / totalPrizeDrawn : 0;
      const strokeDasharray = `${pct * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPercent * circumference;
      accumulatedPercent += pct;
      return {
        ...item,
        count,
        percent: Math.round(pct * 1000) / 10,
        strokeDasharray,
        strokeDashoffset,
        color: RANK_COLORS[item.rank]?.stroke || '#f59e0b',
      };
    });
  }, [prizeStats, totalPrizeDrawn]);

  const formatDate = (iso?: string | null) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 pb-20 pt-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Title & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-800 bg-stone-900/80 px-6 py-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Festival Operations & Analytics
            </span>
            <h1 className="mt-0.5 text-2xl font-extrabold text-white">
              가을 꽃 축제 사전예약 · 럭키드로우 관리자 대시보드
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchDashboard}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2 text-xs font-semibold text-stone-200 transition hover:border-amber-500/40 hover:text-amber-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span>새로고침</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">총 사전예약자 수</span>
              <div className="rounded-xl bg-amber-500/15 p-2 text-amber-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {stats.total.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400">명</span>
            </div>
            <p className="mt-2 text-xs text-stone-400">
              모바일 QR 티켓 및 추첨코드 100% 발급
            </p>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">오늘 신규 예약자</span>
              <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">
                +{stats.today.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400">명 (Today)</span>
            </div>
            <p className="mt-2 text-xs text-stone-400">
              금일 00:00 기준 실시간 집계
            </p>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">추첨권 사용률 (Lucky Draw)</span>
              <div className="rounded-xl bg-orange-500/15 p-2 text-orange-400">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-300">
                {stats.usageRate}%
              </span>
              <span className="text-xs text-stone-400">
                ({stats.usedCouponCount} / {stats.total}건)
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.usageRate)}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-400">등급별 경품 당첨 현황</span>
              <div className="rounded-xl bg-rose-500/15 p-2 text-rose-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
              {[1, 2, 3, 4].map((rank) => {
                const found = prizeStats.find((p) => p.rank === rank);
                return (
                  <div
                    key={rank}
                    className="flex items-center justify-between rounded-lg bg-stone-950/80 px-2.5 py-1.5"
                  >
                    <span className="text-stone-400">{rank}등</span>
                    <span className="font-bold text-stone-100">
                      {found ? found.count : 0}건
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Charts Row: Daily Trend Bar Chart & Prize Distribution Donut Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Daily Registration Trend Chart */}
          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-6 lg:col-span-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">일별 사전예약 추이</h2>
              </div>
              <span className="text-xs text-stone-400">막대 클릭 시 해당 날짜 필터 적용</span>
            </div>

            {chartDates.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-xs text-stone-500">
                아직 등록된 일별 사전예약 데이터가 없습니다.
              </div>
            ) : (
              <div className="mt-6 flex h-52 items-end justify-between gap-3 pt-6 px-2">
                {chartDates.map((d) => {
                  const count = Number(d.count) || 0;
                  const heightPct = Math.max(12, Math.round((count / maxDateCount) * 100));
                  const isSelected = dateFilter === d.date;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => {
                        setDateFilter(isSelected ? 'all' : d.date);
                        setPage(1);
                      }}
                      className="group flex flex-1 flex-col items-center gap-2"
                    >
                      <span className="text-xs font-bold text-amber-300">
                        {count}명
                      </span>
                      <div className="relative flex h-36 w-full max-w-[48px] items-end overflow-hidden rounded-t-xl bg-stone-950/80 p-1">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isSelected
                              ? 'bg-gradient-to-t from-amber-500 to-yellow-300 ring-2 ring-amber-300'
                              : 'bg-gradient-to-t from-amber-600/80 to-orange-400/90 group-hover:from-amber-400 group-hover:to-orange-300'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          isSelected ? 'font-bold text-amber-300' : 'text-stone-400'
                        }`}
                      >
                        {d.date.slice(5)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prize Distribution Donut Chart */}
          <div className="rounded-3xl border border-stone-800 bg-stone-900/75 p-6 lg:col-span-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-400" />
                <h2 className="text-base font-bold text-white">경품 등급별 당첨 분포</h2>
              </div>
              <span className="text-xs text-stone-400">총 {totalPrizeDrawn}건 추첨</span>
            </div>

            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    fill="transparent"
                    stroke="#1c1917"
                    strokeWidth="16"
                  />
                  {totalPrizeDrawn > 0 &&
                    donutSegments.map((seg) => (
                      <circle
                        key={seg.rank}
                        cx="64"
                        cy="64"
                        r="52"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="16"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                      />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-stone-400">사용 완료</span>
                  <span className="text-xl font-black text-white">{totalPrizeDrawn}건</span>
                </div>
              </div>

              <div className="w-full flex-1 space-y-2 text-xs">
                {donutSegments.map((seg) => (
                  <button
                    key={seg.rank}
                    type="button"
                    onClick={() => {
                      const next = prizeRankFilter === String(seg.rank) ? 'all' : String(seg.rank);
                      setPrizeRankFilter(next);
                      setPage(1);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 transition ${
                      prizeRankFilter === String(seg.rank)
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          RANK_COLORS[seg.rank]?.dot || 'bg-amber-400'
                        }`}
                      />
                      <span className="font-semibold text-stone-200">
                        {RANK_COLORS[seg.rank]?.label || `${seg.rank}등`}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-stone-300">
                      {seg.count}건 ({seg.percent}%)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Unified Search Bar */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mr-1">
                <Filter className="h-4 w-4 text-amber-400" />
                <span>필터</span>
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-200 focus:border-amber-400 focus:outline-none"
              >
                <option value="all">📅 모든 날짜 ({stats.total}건)</option>
                {dateCounts.map((item) => (
                  <option key={item.date} value={item.date}>
                    {item.date} ({item.count}건)
                  </option>
                ))}
              </select>

              {/* Coupon Usage Filter */}
              <select
                value={usageFilter}
                onChange={(e) => {
                  setUsageFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-200 focus:border-amber-400 focus:outline-none"
              >
                <option value="all">🎫 추첨권 상태 전체</option>
                <option value="used">✅ 추첨 완료 (사용됨)</option>
                <option value="unused">⏳ 미사용 (추첨 대기)</option>
              </select>

              {/* Prize Rank Filter */}
              <select
                value={prizeRankFilter}
                onChange={(e) => {
                  setPrizeRankFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-200 focus:border-amber-400 focus:outline-none"
              >
                <option value="all">🏆 경품 등급 전체</option>
                <option value="1">1등 · VIP 라운지 패스</option>
                <option value="2">2등 · 한정판 굿즈 패키지</option>
                <option value="3">3등 · 푸드트럭 10,000원권</option>
                <option value="4">4등 · 웰컴 드링크 교환권</option>
              </select>

              {(dateFilter !== 'all' ||
                usageFilter !== 'all' ||
                prizeRankFilter !== 'all' ||
                appliedSearch !== '') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-stone-700"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>필터 초기화</span>
                </button>
              )}
            </div>

            {/* Unified Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="이메일, 전화번호, 쿠폰코드 검색..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-950 pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 transition hover:bg-amber-400"
              >
                검색
              </button>
            </form>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/80 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 text-xs text-stone-400">
            <span>
              조회된 예약 내역 <strong className="text-white">{totalElements}</strong>건
            </span>
            <span>페이지 {page} / {totalPages}</span>
          </div>

          {error && (
            <div className="p-6 text-center text-sm text-rose-400">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-800 bg-stone-950/80 text-stone-400 uppercase">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">ID</th>
                  <th className="px-5 py-3.5 font-semibold">이메일</th>
                  <th className="px-5 py-3.5 font-semibold">전화번호</th>
                  <th className="px-5 py-3.5 font-semibold">예약 일시</th>
                  <th className="px-5 py-3.5 font-semibold">추첨권 코드</th>
                  <th className="px-5 py-3.5 font-semibold">상태</th>
                  <th className="px-5 py-3.5 font-semibold">당첨 경품</th>
                  <th className="px-5 py-3.5 font-semibold">추첨 일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/70">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      데이터를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500">
                      조건에 해당하는 사전예약 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const rankStyle = item.prizeRank
                      ? RANK_COLORS[item.prizeRank]
                      : null;
                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-stone-800/40"
                      >
                        <td className="px-5 py-3.5 font-mono text-stone-400">
                          #{item.id}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-stone-100">
                          {item.email}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-stone-300">
                          {item.phone}
                        </td>
                        <td className="px-5 py-3.5 text-stone-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-stone-500" />
                            {formatDate(item.createdAt)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono font-bold text-amber-300">
                            {item.couponCode || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {item.isCouponUsed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              추첨 완료
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-stone-800 px-2.5 py-0.5 font-medium text-stone-400">
                              <Clock className="h-3 w-3" />
                              미사용
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {item.isCouponUsed && item.prizeRank ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-bold ${
                                rankStyle?.badge || ''
                              }`}
                            >
                              {item.prizeRank}등 · {item.prizeName}
                            </span>
                          ) : (
                            <span className="text-stone-500">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-stone-400">
                          {formatDate(item.usedAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-stone-800 px-6 py-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-1.5 text-xs font-semibold text-stone-300 disabled:opacity-40"
              >
                이전
              </button>
              <span className="px-3 text-xs text-stone-400">
                <strong className="text-amber-300">{page}</strong> / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-1.5 text-xs font-semibold text-stone-300 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
