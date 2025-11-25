from collections.abc import AsyncGenerator
import uuid
# orm allows not to write sql queries and retrieve data in a pythonic way
from sqlalchemy import Column,String,DateTime,ForeignKey,Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine,async_sessionmaker
from sqlalchemy.orm import DeclarativeBase,relationship
import time
import datetime

DATABASE_URL = "sqlite+aiosqlite:///./test.db"

class Base(DeclarativeBase):
    pass

class Asset(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    name = Column(String,nullable=False)
    asset_type = Column(String,nullable=False)
    investment_code = Column(String,nullable=False)
    instrument_type = Column(String,nullable=False)
    risk = Column(String,nullable=False)
    current_value = Column(Float,nullable=False)
    bought_value = Column(Float,nullable=False)
    created_at = Column(DateTime,default=lambda: datetime.datetime.now(datetime.UTC)) 

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine,expire_on_commit=False)

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession,None]:
    async with async_session_maker() as session:
        yield session