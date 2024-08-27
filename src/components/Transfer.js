import React, { useState, useEffect } from "react";
import "./TransferHandover.css";
import searchIcon from './images/Search_icon.png';

const Transfer = () => {
  const [device, setDevice] = useState("");
  const [assetId, setAssetId] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Condition Status");
  const [currentStatus, setCurrentStatus] = useState("Status");

  const [employeeId, setEmployeeId] = useState("");
  const [division, setDivision] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch device details when assetId changes
  useEffect(() => {
    if (assetId) {
      fetchDeviceDetails(assetId);
    }
  }, [assetId]);

  // Fetch employee details when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  // Function to fetch device details
  const fetchDeviceDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/devices/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch device details: ${response.statusText}`);
      }

      const data = await response.json();

      // Update state with fetched data
      setDevice(data.Device);
      setDeviceBrand(data.DeviceBrand);
      setModel(data.Model);
      setSerialNumber(data.SerialNumber);
      setConditionStatus(data.ConditionStatus);
      setCurrentStatus(data.CurrentStatus);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  // Function to fetch employee details
  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch employee details: ${response.statusText}`);
      }

      const data = await response.json();

      // Update state with fetched data
      setDivision(data.Division);
      setFullName(data.FullName);
      setEmail(data.Email);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  // Function to handle the transfer button click
  const handleTransfer = async () => {
    const transferData = {
      assetId,
      device,
      deviceBrand,
      model,
      serialNumber,
      conditionStatus, // Updated field name
      currentStatus, // Updated field name
      employeeId,
      division,
      fullName,
      email,
      issueDate: new Date().toISOString().split('T')[0],
      handoverDate: null // Explicitly set handoverDate to null
    };

    try {
      const response = await fetch('http://localhost:3000/api/Transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Transfer successful!');
      } else {
        console.error('Error response:', data);
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error during transfer:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <button type="submit" className="search-button" style={{ width: '20px', height: '20px', marginLeft: '310px', position: 'relative', top: '28px' }}>
        <img
          src={searchIcon}
          alt="Search"
          style={{ width: '20px', height: '20px', marginLeft: '310px', position: 'relative', top: '28px' }}
        />
      </button>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="device">Device</label>
          <input
            id="device"
            type="text"
            placeholder="Value"
            value={device}
            readOnly
          />
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
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="deviceName">Device Name</label>
          <input
            id="deviceName"
            type="text"
            placeholder="Value"
            value={deviceBrand}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="assetId">Asset ID</label>
          <input
            id="assetId"
            type="text"
            placeholder="Value"
            value={assetId}
            readOnly
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            type="text"
            placeholder="Value"
            value={model}
            readOnly
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            id="serialNumber"
            type="text"
            placeholder="Value"
            value={serialNumber}
            readOnly
          />
        </div>
        <div className="status-group">
          <div className="status-label">
            <span className="material-symbols-outlined">keyboard_command_key</span>
            <label className="status-label">{conditionStatus}</label>
          </div>
          <div className="status-label">
            <span className="material-symbols-outlined">keyboard_command_key</span>
            <label className="status-label">{currentStatus}</label>
          </div>
        </div>
      </div>

      <div className="divider-container">
        <hr className="section-divider" />
        <span className="divider-text">Device Assign To</span>
        <hr className="section-divider" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <button type="submit" className="search-button" style={{ width: '20px', height: '20px', marginLeft: '145px', position: 'relative', top: '28px' }}>
            <img
              src={searchIcon}
              alt="Search"
              style={{ width: '20px', height: '20px', marginLeft: '160px', position: 'relative', top: '28px' }}
            />
          </button>
          <label htmlFor="employeeSearch">Search by employee id</label>
          <div className="search-container">
            <input
              id="employeeSearch"
              type="text"
              placeholder="Search by employee id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            id="employeeId"
            type="text"
            placeholder="Value"
            value={employeeId}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="division">Division</label>
          <select
            id="division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">Value</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Value"
            value={fullName}
            readOnly
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="text"
            placeholder="Value"
            value={email}
            readOnly
          />
        </div>
      </div>

      <div className="form-row action-buttons">
        <button type="button" className="transfer-btn" onClick={handleTransfer}>
          Transfer
        </button>
      </div>
    </div>
  );
};

export default Transfer;
