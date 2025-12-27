import React, { useState, useEffect } from 'react';
import { getAdminRegistrations } from '../../api';
import './Admin.css';

const AdminListPage = () => {
    // 상태 관리
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // api.js에 정의된 함수 호출 (axios 혹은 fetch)
                const result = await getAdminRegistrations();
                
                // [체크] 백엔드 응답이 배열인지 확인
                if (Array.isArray(result)) {
                    setData(result);
                } else if (result && Array.isArray(result.content)) {
                    // Page 객체로 올 경우 content 배열 사용
                    setData(result.content);
                } else {
                    console.warn("데이터 형식이 배열이 아닙니다:", result);
                    setData([]); 
                }
            } catch (err) {
                console.error("데이터 로딩 실패:", err);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 로딩 중일 때
    if (loading) return <div className="admin-container">로딩 중...</div>;
    
    // 에러 발생 시
    if (error) return <div className="admin-container error">{error}</div>;

    return (
        <div className="admin-container">
            <h2>사전예약 신청자 목록</h2>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>쿠폰 번호</th>
                            <th>사용 여부</th>
                            <th>신청 일시</th>
                            <th>개인정보 동의</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    {/* [수정] 백엔드(Spring Boot) 변수명인 카멜 케이스로 변경 */}
                                    <td>{item.couponCode || '-'}</td>
                                    <td>
                                        <span className={item.isCouponUsed ? 'status-used' : 'status-unused'}>
                                            {item.isCouponUsed ? '사용됨' : '미사용'}
                                        </span>
                                    </td>
                                    <td>
                                        {/* 날짜 포맷팅 (ISO 문자열 처리) */}
                                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td>{item.privacyConsent ? '동의' : '미동의'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminListPage;