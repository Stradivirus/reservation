import React, { useState, useEffect } from 'react';
import { getAdminRegistrations } from '../../api';
import './Admin.css';

const AdminListPage = () => {
    // 상태 관리
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    
    // 필터 및 페이지네이션 상태
    const [page, setPage] = useState(1);
    const [dateFilter, setDateFilter] = useState('');
    const [usageFilter, setUsageFilter] = useState('all');
    const [totalPages, setTotalPages] = useState(0);

    // 데이터 불러오기
    useEffect(() => {
        fetchData();
    }, [page, dateFilter, usageFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAdminRegistrations(page, 30, dateFilter || 'all', usageFilter);
            const { content, totalPages, stats: serverStats } = response.data;
            
            setData(content);
            setTotalPages(totalPages);
            setStats(serverStats);
        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
        setLoading(false);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>사전예약 관리자</h1>
                <div className="stats-bar">
                    <span>오늘: <strong>{stats.today}</strong>명</span>
                    <span>전체: <strong>{stats.total}</strong>명</span>
                </div>
            </header>

            <div className="filter-section">
                <input 
                    type="date" 
                    value={dateFilter} 
                    onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} 
                />
                <select 
                    value={usageFilter} 
                    onChange={(e) => { setUsageFilter(e.target.value); setPage(1); }}
                >
                    <option value="all">전체 보기</option>
                    <option value="used">사용함</option>
                    <option value="unused">미사용</option>
                </select>
                <button onClick={fetchData}>새로고침</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>등록일시</th>
                            <th>쿠폰코드</th>
                            <th>사용여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">로딩 중...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="5">데이터가 없습니다.</td></tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className={item.isCouponUsed ? 'used-row' : ''}>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    <td>{item.couponCode}</td>
                                    <td>
                                        <span className={`status-badge ${item.isCouponUsed ? 'used' : 'unused'}`}>
                                            {item.isCouponUsed ? '사용완료' : '미사용'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>이전</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>다음</button>
            </div>
        </div>
    );
};

export default AdminListPage;