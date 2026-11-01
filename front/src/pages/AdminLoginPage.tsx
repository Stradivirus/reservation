import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Zap, AlertCircle, User } from 'lucide-react';
import { adminLogin } from '../api';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/list');
    } catch (err: any) {
      setError(err.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDemoLogin = async () => {
    const demoId = 'admin';
    const demoPw = 'Tjdwhd23!!';
    setUsername(demoId);
    setPassword(demoPw);
    setError('');
    setLoading(true);

    try {
      await adminLogin(demoId, demoPw);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/list');
    } catch {
      // Fallback for demo mode even if backend login endpoint is unreachable
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/85 p-7 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            관리자 대시보드 로그인
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            사전예약 현황, 일별 통계 차트 및 럭키드로우 당첨 내역을 관리합니다.
          </p>
        </div>

        {/* Portfolio Visitor One-Click Demo Button */}
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Portfolio Reviewer Mode
              </span>
              <p className="mt-0.5 text-xs text-stone-300">
                포트폴리오 방문자분들은 아래 버튼으로 즉시 접속하실 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDirectDemoLogin}
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-extrabold text-stone-950 shadow-md shadow-amber-500/20 transition hover:brightness-110"
          >
            <Zap className="h-4 w-4" />
            <span>원클릭 관리자 데모 로그인</span>
          </button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-stone-500">
          <div className="h-px flex-1 bg-stone-800" />
          <span>또는 계정 직접 입력</span>
          <div className="h-px flex-1 bg-stone-800" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300">관리자 아이디</label>
            <div className="relative mt-1.5">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full rounded-xl border border-stone-700 bg-stone-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300">비밀번호</label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-stone-700 bg-stone-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-stone-700 bg-stone-800 py-3 text-sm font-bold text-stone-100 transition hover:bg-stone-700"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
