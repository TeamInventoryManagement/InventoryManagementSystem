import React, { useState, useEffect } from "react";
import "./TransferHandover.css";
import searchIcon from './images/Search_icon.png';

const Handover = () => {
  const [assetId, setAssetId] = useState("");
  const [device, setDevice] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Condition Status");
  const [currentStatus, setCurrentStatus] = useState("Status");

  const [employeeId, setEmployeeId] = useState("");
  const [division, setDivision] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (assetId) {
      console.log(`Fetching data for Asset ID: ${assetId}`);
      fetch(`http://localhost:3000/api/transfer/${assetId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('TransferDetails data retrieved:', data);

          setDevice(data.Device);
          setDeviceBrand(data.DeviceBrand);
          setModel(data.Model);
          setSerialNumber(data.SerialNumber);
          setConditionStatus(data.ConditionStatus);
          setCurrentStatus(data.CurrentStatus);
          setEmployeeId(data.EmployeeID);
          setFullName(data.FullName);
          setDivision(data.Division);
          setEmail(data.Email);
        })
        .catch(error => {
          console.error('Error fetching transfer details:', error);
        });
    }
  }, [assetId]);

  const handleHandover = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/handover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          currentStatus: 'Handover',
          handoverDate: new Date().toISOString().split('T')[0],
        }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        console.log('error testing')
        const data = await response.json();
        if (response.ok) {
          alert('Handover successful!');
        } else {
          alert('Error: ' + data.error);
        }
      } else {
        const textResponse = await response.text();
        console.error('Unexpected response:', textResponse);
        alert('An unexpected error occurred. Please check the server response.');
      }
    } catch (error) {
      console.error('Error during handover:', error.message);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <button type="submit" className="search-button" style={{ width: '20px', height: '20px', marginLeft: '310px', position: 'relative', top: '28px' }}>
        <img
          src={searchIcon}
          alt="Search"
          style={{ width: '20px', height: '20px', marginLeft: '180px', position: 'relative', top: '28px' }}
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
          <label htmlFor="deviceName">Device Brand</label>
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
              style={{ width: '20px', height: '20px', marginLeft: '145px', position: 'relative', top: '28px' }}
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
        <button type="button" className="handover-btn" onClick={handleHandover}>
          Handover
        </button>
      </div>
    </div>
  );
};

export default Handover;
