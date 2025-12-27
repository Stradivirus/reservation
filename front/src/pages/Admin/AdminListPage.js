import React, { useState, useEffect } from 'react';
import { getAdminRegistrations } from '../../api';
import './Admin.css';

const AdminListPage = () => {
    // 상태 관리
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 필터 및 페이지네이션 상태
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(30);
    const [dateFilter, setDateFilter] = useState('all');
    const [usageFilter, setUsageFilter] = useState('all');
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 데이터 불러오기
    useEffect(() => {
        fetchData();
    }, [page, pageSize, dateFilter, usageFilter]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await getAdminRegistrations(page, pageSize, dateFilter, usageFilter);
            
            // 백엔드 응답 구조: { content, totalPages, stats, ... }
            setData(result.content || []);
            setTotalPages(result.totalPages || 0);
            setTotalElements(result.totalElements || 0);
            setStats(result.stats || { today: 0, total: 0 });
            
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // 날짜 필터 변경
    const handleDateFilterChange = (e) => {
        setDateFilter(e.target.value);
        setPage(1); // 필터 변경 시 첫 페이지로
    };

    // 사용여부 필터 변경
    const handleUsageFilterChange = (filter) => {
        setUsageFilter(filter);
        setPage(1);
    };

    // 페이지 크기 변경
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setPage(1);
    };

    // 로딩 중
    if (loading) {
        return <div className="admin-container loading-state">데이터를 불러오는 중...</div>;
    }
    
    // 에러 발생
    if (error) {
        return (
            <div className="admin-container error-state">
                <p>{error}</p>
                <button onClick={fetchData} className="retry-button">다시 시도</button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="title-section">
                    <h1>사전예약 관리자</h1>
                    <div className="stats-bar">
                        <span>오늘: <strong>{stats.today}</strong>명</span>
                        <span>전체: <strong>{stats.total}</strong>명</span>
                    </div>
                </div>
                
                {/* 페이지 크기 선택 */}
                <div className="page-size-selector">
                    <button 
                        className={`size-btn ${pageSize === 30 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(30)}
                    >
                        30개씩
                    </button>
                    <button 
                        className={`size-btn ${pageSize === 50 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(50)}
                    >
                        50개씩
                    </button>
                    <button 
                        className={`size-btn ${pageSize === 100 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(100)}
                    >
                        100개씩
                    </button>
                </div>
            </header>

            {/* 필터 섹션 */}
            <div className="filter-section">
                <div className="filter-group">
                    <label>날짜 필터:</label>
                    <input 
                        type="date" 
                        value={dateFilter === 'all' ? '' : dateFilter} 
                        onChange={handleDateFilterChange}
                    />
                    <button 
                        onClick={() => { setDateFilter('all'); setPage(1); }}
                        className="reset-btn"
                    >
                        전체
                    </button>
                </div>

                <div className="filter-group">
                    <label>사용 여부:</label>
                    <button 
                        className={`filter-btn ${usageFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleUsageFilterChange('all')}
                    >
                        전체
                    </button>
                    <button 
                        className={`filter-btn ${usageFilter === 'used' ? 'active' : ''}`}
                        onClick={() => handleUsageFilterChange('used')}
                    >
                        사용함
                    </button>
                    <button 
                        className={`filter-btn ${usageFilter === 'unused' ? 'active' : ''}`}
                        onClick={() => handleUsageFilterChange('unused')}
                    >
                        미사용
                    </button>
                </div>

                <button onClick={fetchData} className="refresh-btn">🔄 새로고침</button>
            </div>

            {/* 테이블 */}
            <div className="table-container">
                <div className="result-info">
                    총 {totalElements}개 중 {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalElements)}개 표시
                </div>
                
                <table className="admin-table">
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
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">데이터가 없습니다.</td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{new Date(item.createdAt).toLocaleString('ko-KR')}</td>
                                    <td className={item.isCouponUsed ? 'used-coupon' : ''}>
                                        {item.couponCode || '-'}
                                    </td>
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

            {/* 페이지네이션 */}
            <div className="pagination">
                <button 
                    disabled={page === 1} 
                    onClick={() => handlePageChange(1)}
                    className="page-btn"
                >
                    « 처음
                </button>
                <button 
                    disabled={page === 1} 
                    onClick={() => handlePageChange(page - 1)}
                    className="page-btn"
                >
                    ‹ 이전
                </button>
                
                <span className="page-info">
                    {page} / {totalPages}
                </span>
                
                <button 
                    disabled={page === totalPages} 
                    onClick={() => handlePageChange(page + 1)}
                    className="page-btn"
                >
                    다음 ›
                </button>
                <button 
                    disabled={page === totalPages} 
                    onClick={() => handlePageChange(totalPages)}
                    className="page-btn"
                >
                    마지막 »
                </button>
            </div>
        </div>
    );
};

export default AdminListPage;