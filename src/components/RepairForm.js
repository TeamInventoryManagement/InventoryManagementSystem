import React, { useState } from 'react';
import './Repairform.css';

function RepairForm() {
  const [device, setDevice] = useState('');
  const [assetID, setAssetID] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [repairStatus, setRepairStatus] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [repairCost, setRepairCost] = useState('');

  const handleDeviceChange = (e) => {
    setDevice(e.target.value);
    // Logic to fetch data from database based on device and assetID
    if (e.target.value && assetID) {
      setDeviceName('LAP-0088'); // Mocked value
      setModel('HP Probook Notebook'); // Mocked value
      setSerialNumber('SN123456'); // Mocked value
    }
  };

  const handleAssetIDChange = (e) => {
    setAssetID(e.target.value);
    // Logic to fetch data from database based on device and assetID
    if (device && e.target.value) {
      setDeviceName('LAP-0088'); // Mocked value
      setModel('HP Probook Notebook'); // Mocked value
      setSerialNumber('SN123456'); // Mocked value
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form className="repair-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-section">
          <label htmlFor="device">Device</label>
          <select
            id="device"
            value={device}
            onChange={handleDeviceChange}
            className="form-input"
          >
            <option value="">Select Device</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            {/* Add more device options as needed */}
          </select>
        </div>
        <div className="form-section">
          <label htmlFor="assetID">Asset ID</label>
          <input
            id="assetID"
            type="text"
            value={assetID}
            onChange={handleAssetIDChange}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-section">
          <label htmlFor="deviceName">Device Name</label>
          <input
            id="deviceName"
            type="text"
            value={deviceName}
            className="form-input"
            disabled
          />
        </div>
        <div className="form-section">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            type="text"
            value={model}
            className="form-input"
            disabled
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-section">
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            value={serialNumber}
            className="form-input"
            disabled
          />
        </div>
      </div>

      <div className="divider-container">
  <hr className="section-divider" />
  <span className="divider-text">Repair Details</span>
  <hr className="section-divider" />
</div>


<div className="form-row">
  <div className="form-section">
    <label htmlFor="issueDate">Issued Date to Vendor</label>
    <input
      id="issueDate"
      type="date"
      value={issueDate}
      onChange={(e) => setIssueDate(e.target.value)}
      className="form-input"
    />
  </div>
  <div className="form-section">
    <label htmlFor="receivedDate">Received Date from Vendor</label>
    <input
      id="receivedDate"
      type="date"
      value={receivedDate}
      onChange={(e) => setReceivedDate(e.target.value)}
      className="form-input"
    />
  </div>
</div>


      <div className="form-row">
        <div className="form-section">
          <label htmlFor="vendor">Vendor</label>
          <input
            id="vendor"
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
  <div className="form-section date-field">
    <label htmlFor="issueDate">Issued Date to Vendor</label>
    <input
      id="issueDate"
      type="date"
      value={issueDate}
      onChange={(e) => setIssueDate(e.target.value)}
      className="form-input-sp"
    />
  </div>
  <div className="form-section date-field">
    <label htmlFor="receivedDate">Received Date from Vendor</label>
    <input
      id="receivedDate"
      type="date"
      value={receivedDate}
      onChange={(e) => setReceivedDate(e.target.value)}
      className="form-input-sp"
    />
  </div>
</div>

      <div className="form-row">
        <div className="form-section">
          <label htmlFor="repairCost">Repair Cost (LKR)</label>
          <input
            id="repairCost"
            type="text"
            value={repairCost}
            onChange={(e) => setRepairCost(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Update</button>
      </div>
    </form>
  );
}

export default RepairForm;
