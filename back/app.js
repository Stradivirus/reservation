const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment-timezone');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware 설정
app.use(cors({
   origin: 'http://34.64.132.7:8080',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true,
}));
app.use(express.json());

// 데이터베이스 연결 설정
const sequelize = new Sequelize('preregistration_db', 'myuser', 'mypassword', {
   host: 'db',
   dialect: 'postgres'
});

// 사전등록 모델 정의
const Preregistration = sequelize.define('preregistrations_preregistration', {
   email: {
       type: DataTypes.STRING,
       unique: true
   },
   phone: {
       type: DataTypes.STRING(11),
       unique: true
   },
   privacy_consent: {
       type: DataTypes.BOOLEAN
   },
   created_at: {
       type: DataTypes.DATE
   },
   coupon_code: {
       type: DataTypes.STRING,
       unique: true
   },
   is_coupon_used: {
       type: DataTypes.BOOLEAN,
       defaultValue: false
   }
}, {
   tableName: 'preregistrations_preregistration',
   timestamps: true,
   createdAt: false,
   updatedAt: false
});

// 이메일 중복 체크 API 엔드포인트
app.post('/api/check-email', async (req, res) => {
   const { email } = req.body;
   try {
       const emailExists = await Preregistration.findOne({ where: { email } });
       if (emailExists) {
           return res.status(400).json({ detail: '이미 등록된 이메일 주소입니다.' });
       }
       return res.status(200).json({ message: '사용 가능한 이메일 주소입니다.' });
   } catch (error) {
       console.error('Error in check-email:', error);
       return res.status(500).json({ detail: '서버 오류가 발생했습니다.' });
   }
});

// 전화번호 중복 체크 API 엔드포인트
app.post('/api/check-phone', async (req, res) => {
   const { phone } = req.body;
   try {
       const phoneExists = await Preregistration.findOne({ where: { phone } });
       if (phoneExists) {
           return res.status(400).json({ detail: '이미 등록된 전화번호입니다.' });
       }
       return res.status(200).json({ message: '사용 가능한 전화번호입니다.' });
   } catch (error) {
       console.error('Error in check-phone:', error);
       return res.status(500).json({ detail: '서버 오류가 발생했습니다.' });
   }
});

// 사전등록 API 엔드포인트
// 사전등록 API 엔드포인트
app.post('/api/preregister', async (req, res) => {
    const { email, phone, privacy_consent } = req.body;
    
    try {
        // 이메일 중복 체크
        const emailExists = await Preregistration.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ detail: '이미 등록된 이메일 주소입니다.' });
        }
        
        // 전화번호 중복 체크
        const phoneExists = await Preregistration.findOne({ where: { phone } });
        if (phoneExists) {
            return res.status(400).json({ detail: '이미 등록된 전화번호입니다.' });
        }
        
        // 쿠폰 서비스에서 쿠폰 코드 생성 요청
        console.log('쿠폰 서비스 호출 시도');
        const couponResponse = await axios.post('http://coupon:8085/coupon/generate');
        console.log('쿠폰 서비스 응답:', couponResponse.data);
        const couponCode = couponResponse.data.coupon_code;
 
        const now = moment().tz('Asia/Seoul');
        
        // 새로운 사전등록 데이터 생성
        const newPreregistration = await Preregistration.create({
            email,
            phone,
            privacy_consent,
            created_at: now,
            coupon_code: couponCode,
            is_coupon_used: false
        });
 
        // 총 등록자 수 확인
        const totalCount = await Preregistration.count();
        
        // Notification 서비스로 알림 전송
        try {
            await axios.post('http://notification:8084/notifications/milestone', {
                count: totalCount
            });
        } catch (error) {
            console.error('Notification service error:', error);
            // 알림 실패는 전체 프로세스에 영향을 주지 않음
        }
        
        return res.status(200).json({
            message: '사전 등록이 완료되었습니다.',
            created_at: now.format('YYYY-MM-DD HH:mm:ss'),
            coupon_code: couponCode
        });
        
    } catch (error) {
        console.error('Error in preregister:', error);
        if (error.response?.data) {
            // 쿠폰 서비스 에러
            return res.status(500).json({ detail: '쿠폰 생성 중 오류가 발생했습니다.' });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ detail: '이메일 또는 전화번호가 이미 등록되어 있습니다.' });
        }
        return res.status(500).json({ detail: error.message });
    }
 });

// 서버 시작
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
   try {
       await sequelize.authenticate();
       console.log('데이터베이스 연결 성공');
       console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
   } catch (error) {
       console.error('데이터베이스 연결 실패:', error);
   }
});

module.exports = app;