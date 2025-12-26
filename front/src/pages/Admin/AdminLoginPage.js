import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api';
import './Admin.css';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault(); // 버튼 클릭 시에도 호출될 수 있으므로 예외 처리
        try {
            await adminLogin(username, password);
            // 로그인 성공 처리
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/list');
        } catch (err) {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    // [추가] 관리자 바로 로그인 기능
    const handleDirectLogin = () => {
        const adminId = 'admin';
        const adminPw = 'Tjdwhd23!!'; // 아까 설정한 새 비밀번호

        setUsername(adminId);
        setPassword(adminPw);
        
        // 상태 업데이트는 비동기라 바로 login 호출하면 빈 값이 갈 수 있음.
        // 따라서 직접 값을 넣어 호출하거나, 폼을 채우고 사용자가 로그인 누르게 유도.
        // 여기서는 편의상 바로 API를 호출해 드립니다.
        
        adminLogin(adminId, adminPw)
            .then(() => {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin/list');
            })
            .catch(() => {
                setError('관리자 바로 로그인 실패 (비밀번호를 확인하세요)');
            });
    };

    return (
        <div className="admin-login-container">
            <div className="login-box">
                <h2>관리자 로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>아이디</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    
                    <button type="submit" className="login-btn">로그인</button>
                    
                    {/* [추가] 관리자 바로 로그인 버튼 */}
                    <button 
                        type="button" 
                        className="admin-direct-btn" 
                        onClick={handleDirectLogin}
                        style={{ marginTop: '10px', backgroundColor: '#6c757d' }}
                    >
                        관리자 바로 로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;