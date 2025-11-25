import { useState } from "react";
import "../styling/styles.css";

function AssetCard({ asset, onDelete, onEdit }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const getRiskClass = (risk) => {
    const r = risk?.toLowerCase();
    if (r === "low") return "risk-badge low";
    if (r === "medium") return "risk-badge medium";
    if (r === "high") return "risk-badge high";
    return "risk-badge";
  };

  return (
    <>
      <div className="asset-card">
        <div className="asset-card-header">
          <h3>{asset.name}</h3>
          <p className="code">{asset.investment_code}</p>
        </div>

        <div className="asset-body">
          <div className="row">
            <span>Type</span>
            <span>{asset.asset_type}</span>
          </div>

          <div className="row">
            <span>Instrument</span>
            <span>{asset.instrument_type}</span>
          </div>

          <div className="row">
            <span>Risk</span>
            <span className={getRiskClass(asset.risk)}>{asset.risk}</span>
          </div>

          <div className="row value-row">
            <span>Value</span>
            <span className="value">
              ₹{asset.current_value?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="asset-actions">
          <button className="btn primary small" onClick={() => onEdit(asset)}>
            Edit
          </button>

          <button
            className="btn danger small"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-box">
            <h3>Delete "{asset.name}"?</h3>
            <p>This action cannot be undone.</p>

            <div className="confirm-actions">
              <button
                className="btn cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  onDelete(asset.id);
                  setShowConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssetCard;
