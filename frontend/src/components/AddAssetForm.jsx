import { useState } from "react";
import "../styling/styles.css";

function AddAssetForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    asset_type: "Mutual Fund",
    investment_code: "",
    instrument_type: "",
    risk: "Medium",
    current_value: "",
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
          <h2>Add Asset</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Asset name"
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
              type="text"
              required
              value={formData.investment_code}
              onChange={(e) =>
                setFormData({ ...formData, investment_code: e.target.value })
              }
              placeholder="Code"
            />
          </div>

          <div className="form-field">
            <label>Instrument Type</label>
            <input
              type="text"
              required
              value={formData.instrument_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instrument_type: e.target.value,
                })
              }
              placeholder="e.g., Equity"
            />
          </div>

          <div className="form-field">
            <label>Risk Level</label>
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
              required
              min="0"
              value={formData.current_value}
              onChange={(e) =>
                setFormData({ ...formData, current_value: e.target.value })
              }
              placeholder="50000"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn cancel">
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssetForm;
