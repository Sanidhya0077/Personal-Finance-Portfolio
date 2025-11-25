import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getAllAssets = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};

export const createAsset = async (assetData) => {
  const response = await axios.post(`${API_BASE_URL}/create_asset`, assetData);
  return response.data;
};

export const updateAsset = async (assetId, assetData) => {
  const response = await axios.put(
    `${API_BASE_URL}/update_asset/${assetId}`,
    assetData
  );
  console.log(response);
  return response.data;
};

export const deleteAsset = async (assetId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/delete_asset/${assetId}`
  );
  return response.data;
};
