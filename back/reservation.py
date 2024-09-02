from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
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

# 데이터베이스 연결
DATABASE_URL = "postgresql://myuser:mypassword@localhost/preregistration_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 데이터베이스 모델
class Preregistration(Base):
    __tablename__ = "preregistrations_preregistration"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String(11), unique=True, index=True)
    privacy_consent = Column(Boolean)
    created_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Seoul')))

class PreregistrationCreate(BaseModel):
    email: str
    phone: str = Field(..., max_length=11)
    privacy_consent: bool

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

@app.post("/api/preregister")
async def preregister(preregistration: PreregistrationCreate):
    db = SessionLocal()
    try:
        db_preregistration = Preregistration(**preregistration.dict())
        db.add(db_preregistration)
        db.commit()
        db.refresh(db_preregistration)
        return {
            "message": "사전 등록이 완료되었습니다.", 
            "created_at": db_preregistration.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
