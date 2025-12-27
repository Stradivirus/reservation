import React, { useState, useEffect } from 'react';
import { getAdminRegistrations } from '../../api';
import './Admin.css';

const AdminListPage = () => {
    // 상태 관리
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 0 });
    const [dateCounts, setDateCounts] = useState([]); // [추가] 날짜별 카운트
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
            
            setData(result.content || []);
            setTotalPages(result.totalPages || 0);
            setTotalElements(result.totalElements || 0);
            setStats(result.stats || { today: 0, total: 0 });
            setDateCounts(result.dateCounts || []); // [추가] 날짜별 카운트 설정
            
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
    const handleDateFilterChange = (date) => {
        setDateFilter(date);
        setPage(1);
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

    // [추가] UTC → KST 변환 함수
    const formatKSTDate = (utcDateString) => {
        const utcDate = new Date(utcDateString);
        // 한국 시간대로 변환 (UTC+9)
        return utcDate.toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
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
        <div className="admin-wrapper">
            {/* 헤더 */}
            <header className="admin-header">
                <div className="title-section">
                    <h1>사전 등록 목록</h1>
                    <div className="registration-count">
                        총 등록 인원: <strong>{stats.total}</strong>명 / 오늘 등록 인원: <strong>{stats.today}</strong>명
                    </div>
                </div>
                
                {/* 페이지 크기 선택 */}
                <div className="page-size-filter">
                    <button 
                        className={`filter-button ${pageSize === 30 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(30)}
                    >
                        30개씩
                    </button>
                    <button 
                        className={`filter-button ${pageSize === 50 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(50)}
                    >
                        50개씩
                    </button>
                    <button 
                        className={`filter-button ${pageSize === 100 ? 'active' : ''}`}
                        onClick={() => handlePageSizeChange(100)}
                    >
                        100개씩
                    </button>
                </div>
            </header>

            <div className="admin-container">
                {/* 왼쪽 사이드바 - 날짜 필터 */}
                <div className="sidebar">
                    <h2>날짜 필터</h2>
                    <div className="button-container">
                        <button 
                            className={`sidebar-button ${dateFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleDateFilterChange('all')}
                        >
                            전체 날짜
                        </button>
                        {dateCounts.map((dateCount) => (
                            <button
                                key={dateCount.date}
                                className={`sidebar-button ${dateFilter === dateCount.date ? 'active' : ''}`}
                                onClick={() => handleDateFilterChange(dateCount.date)}
                            >
                                {dateCount.date}
                                <span className="count-badge">({dateCount.count}명)</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="main-content">
                    {/* 사용여부 필터 */}
                    <div className="usage-filter">
                        <div className="filter-buttons">
                            <button 
                                className={`filter-button ${usageFilter === 'all' ? 'active' : ''}`}
                                onClick={() => handleUsageFilterChange('all')}
                            >
                                전체
                            </button>
                            <button 
                                className={`filter-button ${usageFilter === 'used' ? 'active' : ''}`}
                                onClick={() => handleUsageFilterChange('used')}
                            >
                                쿠폰 사용
                            </button>
                            <button 
                                className={`filter-button ${usageFilter === 'unused' ? 'active' : ''}`}
                                onClick={() => handleUsageFilterChange('unused')}
                            >
                                쿠폰 미사용
                            </button>
                        </div>

                        {/* 페이지네이션 */}
                        <div className="pagination">
                            {page > 1 && (
                                <>
                                    <button onClick={() => handlePageChange(1)} className="page-button">« 처음</button>
                                    <button onClick={() => handlePageChange(page - 1)} className="page-button">이전</button>
                                </>
                            )}
                            
                            <span className="page-button active">{page}</span>
                            
                            {page < totalPages && (
                                <>
                                    <button onClick={() => handlePageChange(page + 1)} className="page-button">다음</button>
                                    <button onClick={() => handlePageChange(totalPages)} className="page-button">마지막 »</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 테이블 */}
                    <div className="table-container">
                        <table className="registration-table">
                            <thead>
                                <tr>
                                    <th>이메일</th>
                                    <th>전화번호</th>
                                    <th>개인정보 동의</th>
                                    <th>등록 일시</th>
                                    <th>쿠폰 코드</th>
                                    <th>사용 여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-data">데이터가 없습니다.</td>
                                    </tr>
                                ) : (
                                    data.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.privacyConsent ? '예' : '아니오'}</td>
                                            <td>{formatKSTDate(item.createdAt)}</td>
                                            <td className={item.isCouponUsed ? 'used-coupon' : ''}>
                                                {item.couponCode || '없음'}
                                            </td>
                                            <td className={item.isCouponUsed ? 'used-coupon' : ''}>
                                                {item.isCouponUsed ? '사용' : '미사용'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminListPage;