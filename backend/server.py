from fastapi import FastAPI,HTTPException,Depends
from schemas import AssetCreate
from db import Asset, create_db_and_tables, get_async_session
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from contextlib import asynccontextmanager
from sqlalchemy import select
import uuid
from fastapi.middleware.cors import CORSMiddleware

# 
@asynccontextmanager
async def lifespan(app : FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


# Add after app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_all_assets(
    session: AsyncSession =Depends(get_async_session)
):
    result = await session.execute(select(Asset).order_by(Asset.created_at.desc()))
    assets = [row[0] for row in result.all()]

    assets_data = []
    for asset in assets:
        assets_data.append({
            "id": str(asset.id),
            "name" : asset.name,
            "asset_type" : asset.asset_type,
            "investment_code" : asset.investment_code,
            "instrument_type": asset.instrument_type,
            "current_value" : asset.current_value,
            "bought_value": asset.bought_value,
            "risk":asset.risk,
            "created_at": asset.created_at.isoformat(),
        })
    return {"assets":assets_data}

@app.post("/create_asset")
async def create_assets(
    asset: AssetCreate,
    session: AsyncSession = Depends(get_async_session),
) -> dict:
    """Create an Asset from the provided AssetCreate payload and return a serializable dict."""
    # We always pass key based arguments to pass the parameters in the model object to avoid errors
    try:
        asset_obj = Asset(
            name = asset.name,
            asset_type=asset.asset_type,
            investment_code=asset.investment_code,
            instrument_type=asset.instrument_type,
            risk=asset.risk,
            bought_value = asset.bought_value,
            current_value = asset.current_value,
            returns=  asset_obj.returns,

        )
        session.add(asset_obj)
        await session.commit()
        await session.refresh(asset_obj)
        return {
            "id": str(asset_obj.id),
            "name" : asset.name,
            "asset_type": asset_obj.asset_type,
            "investment_code": asset_obj.investment_code,
            "instrument_type": asset_obj.instrument_type,
            "assets_value" : asset_obj.current_value,
            "risk": asset_obj.risk,
            "bought_value": asset.bought_value,
            "created_at": asset_obj.created_at.isoformat(),
            "returns":asset_obj.returns,
        }
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=500, detail="Failed to create asset")

@app.put("/update_asset/{asset_id}")
async def update_asset(
    asset_id: str,
    asset: AssetCreate,
    session: AsyncSession = Depends(get_async_session),
) -> dict:
    """Update an existing asset by ID."""
    try:
        asset_uuid = uuid.UUID(asset_id)
        result = await session.execute(select(Asset).where(Asset.id == asset_uuid))
        asset_obj = result.scalar_one_or_none()
        
        if not asset_obj:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        # Update fields
        asset_obj.name = asset.name
        asset_obj.asset_type = asset.asset_type
        asset_obj.investment_code = asset.investment_code
        asset_obj.instrument_type = asset.instrument_type
        asset_obj.risk = asset.risk
        asset_obj.bought_value = asset.bought_value
        asset_obj.current_value = asset.current_value
        
        await session.commit()
        await session.refresh(asset_obj)
        
        return {
            "id": str(asset_obj.id),
            "name": asset_obj.name,
            "asset_type": asset_obj.asset_type,
            "investment_code": asset_obj.investment_code,
            "instrument_type": asset_obj.instrument_type,
            "risk": asset_obj.risk,
            "current_value": asset_obj.current_value,
            "bought_value": asset_obj.bought_value,
            "created_at": asset_obj.created_at.isoformat(),
        }
    except HTTPException:
        raise
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=500, detail="Failed to update asset")


@app.delete("/delete_asset/{asset_id}")
async def delete_asset(
    asset_id: str,
    session: AsyncSession = Depends(get_async_session),
) -> dict:
    """Delete an asset by ID."""
    try:
        asset_uuid = uuid.UUID(asset_id)
        result = await session.execute(select(Asset).where(Asset.id == asset_uuid))
        asset_obj = result.scalar_one_or_none()
        
        if not asset_obj:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        await session.delete(asset_obj)
        await session.commit()
        
        return {"message": "Asset deleted successfully", "id": asset_id}
    except HTTPException:
        raise
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=500, detail="Failed to delete asset")


# mongodb://localhost:27017/
