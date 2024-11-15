const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment-timezone');
const crypto = require('crypto');

const app = express();

// Middleware 설정
app.use(cors({
    origin: 'http://localhost:8080', // React 앱의 주소 (Docker Compose에서 8080 포트로 매핑됨)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키와 같은 자격 증명 허용
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

// 쿠폰 코드 생성 함수
function generateCouponCode() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';
    
    const randomBytes = crypto.randomBytes(10);
    
    for (let i = 0; i < 8; i++) {
        const randomIndex = randomBytes[i] % charset.length;
        coupon += charset[randomIndex];
    }
    
    return coupon;
}

// 쿠폰 코드 생성 및 검증 함수
async function generateAndValidateCouponCode() {
    const maxAttempts = 8;
    
    for (let i = 0; i < maxAttempts; i++) {
        const couponCode = generateCouponCode();
        
        const exists = await Preregistration.findOne({
            where: { coupon_code: couponCode }
        });
        
        if (!exists) {
            return couponCode;
        }
    }
    
    throw new Error('유니크한 쿠폰 코드 생성 실패');
}

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
        
        // 쿠폰 코드 생성 및 검증
        const couponCode = await generateAndValidateCouponCode();
        
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
        
        return res.status(200).json({
            message: '사전 등록이 완료되었습니다.',
            created_at: now.format('YYYY-MM-DD HH:mm:ss'),
            coupon_code: couponCode
        });
    } catch (error) {
        console.error('Error in preregister:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ detail: '이메일 또는 전화번호가 이미 등록되어 있습니다.' });
        }
        return res.status(400).json({ detail: error.message });
    }
});

// 쿠폰 사용 API 엔드포인트
app.post('/api/use-coupon', async (req, res) => {
    const { coupon_code } = req.body;
    
    try {
        // 쿠폰 코드 확인
        const preregistration = await Preregistration.findOne({
            where: { coupon_code }
        });
        
        if (!preregistration) {
            return res.status(404).json({ detail: '유효하지 않은 쿠폰 코드입니다.' });
        }
        
        if (preregistration.is_coupon_used) {
            return res.status(400).json({ detail: '이미 사용된 쿠폰입니다.' });
        }
        
        // 쿠폰 사용 처리
        await preregistration.update({ is_coupon_used: true });
        
        return res.status(200).json({ message: '쿠폰이 성공적으로 사용되었습니다.' });
    } catch (error) {
        console.error('Error in use-coupon:', error);
        return res.status(400).json({ detail: error.message });
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