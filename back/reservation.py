from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Table, MetaData, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import pytz

# FastAPI 앱 생성
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

# 기존 테이블 메타데이터 로드
metadata = MetaData()
preregistrations = Table('preregistrations_preregistration', metadata, autoload_with=engine)

# Pydantic 모델 (요청 데이터 검증용)
class PreregistrationCreate(BaseModel):
    email: str
    phone: str = Field(..., max_length=11)
    privacy_consent: bool

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

        # 새로운 사전등록 데이터 삽입
        new_preregistration = preregistrations.insert().values(
            email=preregistration.email,
            phone=preregistration.phone,
            privacy_consent=preregistration.privacy_consent,
            created_at=datetime.now(pytz.timezone('Asia/Seoul'))
        )
        db.execute(new_preregistration)
        db.commit()
        return {
            "message": "사전 등록이 완료되었습니다.",
            "created_at": datetime.now(pytz.timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')
        }
    except IntegrityError as e:
        db.rollback()
        # 데이터베이스 레벨에서 발생하는 중복 오류 처리
        raise HTTPException(status_code=400, detail="이메일 또는 전화번호가 이미 등록되어 있습니다.")
    except HTTPException as e:
        # 이미 발생한 HTTPException 그대로 전달
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)