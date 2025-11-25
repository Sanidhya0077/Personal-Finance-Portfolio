from pydantic import BaseModel


class AssetCreate(BaseModel):
    name : str
    asset_type : str
    investment_code : str
    instrument_type : str
    risk : str
    current_value : float
    bought_value : float

