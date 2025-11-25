import { useState } from "react";
import "../styling/styles.css";

function EditAssetForm({ asset, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: asset.name,
    asset_type: asset.asset_type,
    investment_code: asset.investment_code,
    instrument_type: asset.instrument_type,
    risk: asset.risk,
    current_value: asset.current_value,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      current_value: parseFloat(formData.current_value),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit Asset</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label>Type</label>
            <select
              value={formData.asset_type}
              onChange={(e) =>
                setFormData({ ...formData, asset_type: e.target.value })
              }
            >
              <option>Mutual Fund</option>
              <option>Stocks</option>
              <option>Bonds</option>
            </select>
          </div>

          <div className="form-field">
            <label>Investment Code</label>
            <input
              value={formData.investment_code}
              onChange={(e) =>
                setFormData({ ...formData, investment_code: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label>Instrument Type</label>
            <input
              value={formData.instrument_type}
              onChange={(e) =>
                setFormData({ ...formData, instrument_type: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label>Risk</label>
            <select
              value={formData.risk}
              onChange={(e) =>
                setFormData({ ...formData, risk: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-field">
            <label>Current Value (₹)</label>
            <input
              type="number"
              value={formData.current_value}
              onChange={(e) =>
                setFormData({ ...formData, current_value: e.target.value })
              }
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAssetForm;
