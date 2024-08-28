import React, { useState } from "react";
import "./Accessories.css";

const Accessories = () => {
  const [accessoryType, setAccessoryType] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [assetId, setAssetId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [operationalStatus, setOperationalStatus] = useState("");
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [documentation, setDocumentation] = useState(null);

  // Function to calculate warranty expiry date


  const handleSave = async () => {
    const accessoryData = {
      Device: accessoryType,
      Model: model,
      DeviceBrand: manufacturer,
      SerialNumber: serialNumber,
      DeviceID: deviceID,
      AssetID: assetId,
      PurchaseDate: purchaseDate,
      ConditionStatus: condition,
      CurrentStatus: operationalStatus,
      StorageLocation: storageLocation,
      LastMaintenanceDate: lastMaintenanceDate,
      Notes: notes
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/acces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accessoryData),
      });
  
      const responseData = await response.text(); // Read the response data only once
  
      if (response.ok) {
        alert('Accessory added successfully');
      } else {
        console.error("HTTP error", response.status, responseData);
        alert('Failed to add accessory: ' + responseData);
      }
    } catch (error) {
      console.error("Network error", error);
      alert('Error adding accessory: ' + error.message);
    }
  };
  

 
  return (
    <div className="form-container">
      <h2>Accessories</h2>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="accessoryType">Accessory Type</label>
          <select
            id="accessoryType"
            value={accessoryType}
            onChange={(e) => setAccessoryType(e.target.value)}
          >
            <option value="">Select Accessory Type</option>
            <option value="Keyboard">Keyboard</option>
            <option value="Mouse">Mouse</option>
            <option value="Cable">Cable</option>
            <option value="Adapter">Adapter</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer</label>
          <input
            id="manufacturer"
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            placeholder="Serial Number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deviceID"> Device ID</label>
          <input
            id="deviceID"
            type="text"
            placeholder="Device ID"
            value={deviceID}
            onChange={(e) => setDeviceID(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assetId">Asset ID</label>
          <input
            id="assetId"
            type="text"
            placeholder="Asset ID"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
      </div>
 

 
      <h3>Physical Location</h3>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="storageLocation">Storage Location</label>
          <input
            id="storageLocation"
            type="text"
            placeholder="Storage Location"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>
 
      <h3>Status and Monitoring</h3>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="operationalStatus">Operational Status</label>
          <select
            id="operationalStatus"
            value={operationalStatus}
            onChange={(e) => setOperationalStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="In Use">In Use</option>
            <option value="In Stock">In Stock</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="lastMaintenanceDate">Last Maintenance Date</label>
          <input
            id="lastMaintenanceDate"
            type="date"
            value={lastMaintenanceDate}
            onChange={(e) => setLastMaintenanceDate(e.target.value)}
          />
        </div>
      </div>
 
      <h3>Notes and Documentation</h3>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>
 
      <div className="form-row action-buttons">
        <button type="button" className="save-btn" onClick={handleSave}>
          Save
        </button>

      </div>
    </div>
  );
};
 
export default Accessories;