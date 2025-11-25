// App.jsx
import { useEffect, useState } from "react";
import {
  getAllAssets,
  createAsset,
  deleteAsset,
  updateAsset,
} from "./services/api";
import AssetCard from "./components/AssetCard";
import AddAssetForm from "./components/AddAssetForm";
import "./App.css";
import EditAssetForm from "./components/EditAssetForm";

function App() {
  const [assets, setAssets] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAsset, setEditAsset] = useState(null);

  const handleEditAsset = async (data) => {
    try {
      await updateAsset(editAsset.id, data);
      await fetchAssets();
      setEditAsset(null);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  const fetchAssets = async () => {
    try {
      const data = await getAllAssets();

      // Defensive handling of API shape
      const assetsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.assets)
        ? data.assets
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setAssets(assetsArray);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets =
    selectedType === "all"
      ? assets
      : assets.filter((asset) => asset.asset_type === selectedType);

  const handleAddAsset = async (assetData) => {
    try {
      await createAsset(assetData);
      await fetchAssets();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteAsset(assetId);
      await fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const totalValue = assets.reduce((sum, asset) => {
    const value = Number(asset.current_value) || 0;
    return sum + value;
  }, 0);

  const assetsByType = assets.reduce((acc, asset) => {
    const type = asset.asset_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="app">
      {/* Top Bar */}
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <div className="logo-box">
              <svg
                className="logo-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="app-title">Portfolio</span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-icon"
          >
            <svg
              className="btn-icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Asset</span>
          </button>
        </div>
      </nav>

      <div className="layout">
        {/* Stats */}
        <div className="stats-grid">
          <div className="card">
            <p className="card-label">Total Value</p>
            <p className="card-value">₹{totalValue.toLocaleString("en-IN")}</p>
          </div>
          <div className="card">
            <p className="card-label">Total Assets</p>
            <p className="card-value">{assets.length}</p>
          </div>
          <div className="card">
            <p className="card-label">Categories</p>
            <p className="card-value">{Object.keys(assetsByType).length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="card filter-card">
          <div className="filter-buttons">
            <button
              onClick={() => setSelectedType("all")}
              className={
                "filter-button" +
                (selectedType === "all" ? " filter-button--active" : "")
              }
            >
              All ({assets.length})
            </button>
            {Object.entries(assetsByType).map(([type, count]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={
                  "filter-button" +
                  (selectedType === type ? " filter-button--active" : "")
                }
              >
                {type} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid or Empty State */}
        {filteredAssets.length > 0 ? (
          <div className="assets-grid">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id || asset._id}
                asset={asset}
                onDelete={handleDeleteAsset}
                onEdit={(asset) => setEditAsset(asset)}
              />
            ))}
          </div>
        ) : (
          <div className="card empty-state">
            <div className="empty-icon-wrapper">
              <div className="empty-icon-circle">
                <svg
                  className="empty-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="empty-title">No Assets Found</h3>
            <p className="empty-text">
              {selectedType === "all"
                ? "Add your first asset to get started"
                : `No ${selectedType} assets found`}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary btn-icon"
            >
              <svg
                className="btn-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Asset</span>
            </button>
          </div>
        )}

        {/* Add Asset Modal */}
        {showAddForm && (
          <AddAssetForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddAsset}
          />
        )}
        {editAsset && (
          <EditAssetForm
            asset={editAsset}
            onClose={() => setEditAsset(null)}
            onSubmit={handleEditAsset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
