import React, { useState, useEffect } from "react";
import "./TransferHandover.css";
import searchIcon from './images/Search_icon.png';
 
const RepairForm = () => {
  const [device, setDevice] = useState("");
  const [assetId, setAssetId] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [repairStatus, setRepairStatus] = useState('');
  const [repairInvoiceNumber, setRepairInvoiceNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [repairCost, setRepairCost] = useState('');
  const [repairNote, setRepairNote] = useState('');
 
  useEffect(() => {
    if (assetId) {
      fetchDeviceDetails(assetId);
    }
  }, [assetId]);
 
  const fetchDeviceDetails = async (id) => {
   
  try {
    const response = await fetch(`http://localhost:3000/api/devicesR/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch device details: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);  // Check what data is returned
 
    // Fill state variables based on the returned data
    setDevice(data.Device || '');
    setDeviceBrand(data.DeviceBrand || '');
    setModel(data.Model || '');
    setSerialNumber(data.SerialNumber || '');
 
    // Check if additional data is present
    if (data.RepairStatus !== undefined) {
      setRepairStatus(data.RepairStatus || '');
        setRepairInvoiceNumber(data.InvoiceNumber || '');
        setVendor(data.vendor || '');
        setIssueDate(data.IssueDateToVendor || '');
        setReceivedDate(data.ReceivedDatefromVendor || '');
        setRepairCost(data.RepairCost || '');
       
    } else {
        // Clear additional fields if not present
        setRepairStatus('');
        setRepairInvoiceNumber('');
        setVendor('');
        setIssueDate('');
        setReceivedDate('');
        setRepairCost('');
       
    }
   
} catch (error) {
    console.error('Error fetching device details:', error);
}
};
 
 
 
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/repair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assetId,
          device,
          deviceBrand,
          model,
          serialNumber,
          repairStatus,
          repairInvoiceNumber,
          vendor,
          issueDate,
          receivedDate,
          repairCost
        })
      });
      if (!response.ok) {
        throw new Error('Failed to submit repair data');
      }
      alert('Repair data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit repair data');
    }
  };
 
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="device">Device</label>
            <input id="device" type="text" value={device} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="assetSearch">Search by asset id</label>
            <div className="search-container">
              <input
                id="assetSearch"
                type="text"
                placeholder="Search by asset id"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
              />
              <button type="button" onClick={() => fetchDeviceDetails(assetId)} className="search-button">
                <img src={searchIcon} alt="Search" style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>
        </div>
 
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deviceBrand">Device Brand</label>
            <input id="deviceBrand" type="text" value={deviceBrand} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="assetId">Asset ID</label>
            <input id="assetId" type="text" value={assetId} readOnly />
          </div>
        </div>
 
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input id="model" type="text" value={model} readOnly />
          </div>
 
          <div className="form-group">
            <label htmlFor="serialNumber">Serial Number</label>
            <input id="serialNumber" type="text" value={serialNumber} readOnly />
          </div>
        </div>
 
        <div className="divider-container">
          <hr className="section-divider" />
          <span className="divider-text">Repair Details</span>
          <hr className="section-divider" />
        </div>
 
 
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="repairstatus">Repair Status</label>
          <select
            id="repairstatus"
            value={repairStatus}
            onChange={(e) => setRepairStatus(e.target.value)}
          >
            <option value="">Select Division</option>
            <option value="Issue-Identified">Issue-Identified</option>
            <option value="Send-to-Repair">Send-to-Repair</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        </div>
 
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="RepairInvoiceNumber">Repair Invoice Number</label>
            <input
              id="RepairInvoiceNumber"
              type="text"
              placeholder='Repair Invoice Number'
              value={repairInvoiceNumber}
              onChange={(e) => setRepairInvoiceNumber(e.target.value)}
              className="form-input"
            />
          </div>
 
          <div className="form-group">
            <label htmlFor="vendor">Vendor</label>
            <input
              id="vendor"
              type="text"
              placeholder='Vendor'
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
 
 
        <div className="form-row">
          <div className="form-group date-field">
            <label htmlFor="issueDate">Issued Date to Vendor</label>
            <input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="form-input-sp"
            />
          </div>
          <div className="form-group date-field">
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
          <div className="form-group">
            <label htmlFor="repairCost">Repair Cost (LKR)</label>
            <input
              id="repairCost"
              type="text"
              placeholder='Repair Cost'
              value={repairCost}
              onChange={(e) => setRepairCost(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
 
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="repairNote">Repair Note</label>
            <textarea
              id="repairNote"
              type="text"
              placeholder='repair Note'
              value={repairNote}
              onChange={(e) => setRepairNote(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
 
 
        <div className="form-row action-buttons">
          <button type="button" className="Add-btn" onClick={handleSubmit}>
            Submit
          </button>
          {/* <button type="button" className="Update-btn" onClick={handleUpdate}>
            Update
          </button> */}
        </div>
      </form>
    </div>
  );
};
 
export default RepairForm;
 