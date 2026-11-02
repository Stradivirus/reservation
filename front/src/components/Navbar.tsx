import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RefreshCw, Server, ShieldCheck, Ticket, Gift } from 'lucide-react';
import { fetchLoadBalancerStatus } from '../api';
import { LoadBalancerStatus } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [lbStatus, setLbStatus] = useState<LoadBalancerStatus>({
    frontendNode: 'frontend:3000 (Round-Robin)',
    backendNode: 'backend:8080',
    javaVersion: '24',
    latencyMs: 12,
    checkedAt: '--:--:--',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [nodeSwitched, setNodeSwitched] = useState(false);
  const knownNodesRef = useRef<string[]>([]);

  const checkNode = async () => {
    setRefreshing(true);

    const STORAGE_NODES_KEY = 'reservation_lb_known_nodes';
    const STORAGE_LAST_KEY = 'reservation_lb_last_addr';

    let knownNodes = [...knownNodesRef.current];
    let lastAddr: string | null = null;
    try {
      const savedNodes = sessionStorage.getItem(STORAGE_NODES_KEY);
      if (savedNodes) {
        knownNodes = JSON.parse(savedNodes);
      }
      lastAddr = sessionStorage.getItem(STORAGE_LAST_KEY);
    } catch {
      // Ignore storage errors
    }

    const extractRawAddr = (nodeStr: string) => {
      const match = nodeStr.match(/\(([^)]+)\)/);
      return match ? match[1] : nodeStr;
    };

    let status = await fetchLoadBalancerStatus();
    let rawAddr = extractRawAddr(status.frontendNode);

    // 새로고침(F5) 시 문서 로드(1회) + 상태 체크(1회) = 짝수(2회) 호출로 인해
    // 직전과 동일한 노드에 걸린 경우 1회 추가 호출하여 다음 라운드로빈 노드로 전환
    if (lastAddr && rawAddr === lastAddr) {
      status = await fetchLoadBalancerStatus();
      rawAddr = extractRawAddr(status.frontendNode);
    }

    const hasParens = /\(([^)]+)\)/.test(status.frontendNode);
    if (!knownNodes.includes(rawAddr)) {
      knownNodes.push(rawAddr);
      knownNodes.sort();
    }
    knownNodesRef.current = knownNodes;

    try {
      sessionStorage.setItem(STORAGE_NODES_KEY, JSON.stringify(knownNodes));
      sessionStorage.setItem(STORAGE_LAST_KEY, rawAddr);
    } catch {
      // Ignore storage errors
    }

    const nodeIdx = knownNodes.indexOf(rawAddr) + 1;
    const formattedFrontendNode = hasParens
      ? `frontend-${nodeIdx} (${rawAddr})`
      : status.frontendNode;

    if (lastAddr && lastAddr !== rawAddr) {
      setNodeSwitched(true);
      setTimeout(() => setNodeSwitched(false), 900);
    }

    setLbStatus({
      ...status,
      frontendNode: formattedFrontendNode,
    });

    setTimeout(() => setRefreshing(false), 250);
  };

  useEffect(() => {
    checkNode();
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname.startsWith('/admin');
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-md">
      {/* Top Load Balancer Telemetry Bar (Portfolio Highlight) */}
      <div className="border-b border-amber-500/15 bg-gradient-to-r from-stone-900 via-stone-900/95 to-stone-900 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium transition-all duration-300 ${
                nodeSwitched
                  ? 'border-amber-400 bg-amber-500/20 text-amber-200 scale-[1.03]'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              <span
                className={`h-2 w-2 animate-pulse rounded-full ${
                  nodeSwitched ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              Nginx Load Balanced Node:{' '}
              <strong className="font-mono text-white">{lbStatus.frontendNode}</strong>
            </span>
            <span className="hidden items-center gap-1.5 text-stone-400 sm:inline-flex">
              <Server className="h-3.5 w-3.5 text-amber-400" />
              API Upstream:{' '}
              <code className="rounded bg-stone-800 px-1.5 py-0.5 text-stone-200">
                {lbStatus.backendNode}
              </code>
            </span>
            <span className="hidden items-center gap-1 text-stone-400 md:inline-flex">
              Spring Boot 3.5 · Java <code className="text-amber-300">{lbStatus.javaVersion}</code> · 응답{' '}
              <span className="text-emerald-400">{lbStatus.latencyMs}ms</span>
            </span>
          </div>

          <button
            type="button"
            onClick={checkNode}
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-700 bg-stone-800/90 px-2.5 py-0.5 text-xs font-medium text-stone-200 transition hover:border-amber-500/50 hover:text-amber-300"
            title="클릭할 때마다 Nginx Round-Robin에 의해 frontend-1 ↔ frontend-2 노드가 교차 응답합니다"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>로드밸런서 응답 확인 ({lbStatus.checkedAt})</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl shadow-lg shadow-amber-500/20 transition group-hover:scale-105">
            🍂
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition">
                가을 꽃 축제
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                2026 Festival
              </span>
            </div>
            <p className="text-xs text-stone-400">사전예약 & 모바일 패스 · 100% 당첨 럭키드로우</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              isActive('/')
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>사전예약 · 티켓</span>
          </Link>

          <Link
            to="/use-coupon"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              isActive('/use-coupon')
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>추첨권 사용</span>
            <span className="hidden rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-300 sm:inline">
              Lucky
            </span>
          </Link>

          <Link
            to="/admin"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              isActive('/admin')
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                : 'border border-stone-800 bg-stone-900/70 text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">관리자 대시보드</span>
            <span className="sm:hidden">관리자</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
