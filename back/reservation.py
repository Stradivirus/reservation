from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Table, MetaData, select, Column, String, Boolean, update
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import pytz
import httpx

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 연결 설정
DATABASE_URL = "postgresql://myuser:mypassword@localhost/preregistration_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 기존 테이블 메타데이터 로드 및 새 컬럼 추가
metadata = MetaData()
preregistrations = Table('preregistrations_preregistration', metadata, autoload_with=engine)
if 'coupon_code' not in preregistrations.c:
    Column('coupon_code', String(8), nullable=True, unique=True)
if 'is_coupon_used' not in preregistrations.c:
    Column('is_coupon_used', Boolean, default=False)

metadata.create_all(engine)

# Cloud Function URL
COUPON_FUNCTION_URL = "https://asia-northeast3-reservation-434214.cloudfunctions.net/create_coupon"

class PreregistrationCreate(BaseModel):
    email: str
    phone: str = Field(..., max_length=11)
    privacy_consent: bool

class CouponUse(BaseModel):
    coupon_code: str

async def generate_and_validate_coupon_code():
    max_attempts = 10
    for _ in range(max_attempts):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(COUPON_FUNCTION_URL)
                if response.status_code == 200:
                    coupon_code = response.json()['coupon_code']
                    
                    # 데이터베이스에 쿠폰 코드 존재 여부 확인
                    db = SessionLocal()
                    exists = db.execute(
                        select(preregistrations).where(preregistrations.c.coupon_code == coupon_code)
                    ).first() is not None
                    db.close()

                    if not exists:
                        return coupon_code
                else:
                    raise HTTPException(status_code=500, detail="쿠폰 코드 생성 실패")
        except IntegrityError:
            continue
    
    raise HTTPException(status_code=500, detail="유니크한 쿠폰 코드 생성 실패")

@app.post("/api/preregister")
async def preregister(preregistration: PreregistrationCreate):
    db = SessionLocal()
    try:
        # 이메일 중복 체크
        email_exists = db.execute(
            select(preregistrations).where(preregistrations.c.email == preregistration.email)
        ).first() is not None

        if email_exists:
            raise HTTPException(status_code=400, detail="이미 등록된 이메일 주소입니다.")

        # 전화번호 중복 체크
        phone_exists = db.execute(
            select(preregistrations).where(preregistrations.c.phone == preregistration.phone)
        ).first() is not None

        if phone_exists:
            raise HTTPException(status_code=400, detail="이미 등록된 전화번호입니다.")

        # 쿠폰 코드 생성 및 검증
        coupon_code = await generate_and_validate_coupon_code()

        # 새로운 사전등록 데이터 삽입
        new_preregistration = preregistrations.insert().values(
            email=preregistration.email,
            phone=preregistration.phone,
            privacy_consent=preregistration.privacy_consent,
            created_at=datetime.now(pytz.timezone('Asia/Seoul')),
            coupon_code=coupon_code,
            is_coupon_used=False
        )
        db.execute(new_preregistration)
        db.commit()
        return {
            "message": "사전 등록이 완료되었습니다.",
            "created_at": datetime.now(pytz.timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S'),
            "coupon_code": coupon_code
        }
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="이메일 또는 전화번호가 이미 등록되어 있습니다.")
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

@app.post("/api/use-coupon")
async def use_coupon(coupon: CouponUse):
    db = SessionLocal()
    try:
        # 쿠폰 코드 확인
        result = db.execute(
            select(preregistrations).where(preregistrations.c.coupon_code == coupon.coupon_code)
        ).first()

        if not result:
            raise HTTPException(status_code=404, detail="유효하지 않은 쿠폰 코드입니다.")

        if result.is_coupon_used:
            raise HTTPException(status_code=400, detail="이미 사용된 쿠폰입니다.")

        # 쿠폰 사용 처리
        db.execute(
            update(preregistrations)
            .where(preregistrations.c.coupon_code == coupon.coupon_code)
            .values(is_coupon_used=True)
        )
        db.commit()

        return {"message": "쿠폰이 성공적으로 사용되었습니다."}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)