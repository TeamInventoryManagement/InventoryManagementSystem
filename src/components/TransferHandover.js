import React, { useState } from "react";
import "./TransferHandover.css";

const TransferHandover = () => {
  const [device, setDevice] = useState("");
  const [assetId, setAssetId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Condition Status");
  const [currentStatus, setCurrentStatus] = useState("Status");

  const [employeeId, setEmployeeId] = useState("");
  const [division, setDivision] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Mock function to simulate autofill based on Asset ID
  const handleAssetAutoFill = () => {
    if (assetId === "0001") {
      setDeviceName("HP ProBook 450");
      setModel("HP");
      setSerialNumber("SN12345");
      setConditionStatus("Good");
      setCurrentStatus("In Use");
    } else {
      setDeviceName("");
      setModel("");
      setSerialNumber("");
      setConditionStatus("Condition Status");
      setCurrentStatus("Status");
    }
  };

  // Mock function to simulate autofill based on Employee ID
  const handleEmployeeAutoFill = () => {
    if (employeeId === "E001") {
      setDivision("IT");
      setFullName("John Doe");
      setEmail("john.doe@example.com");
    } else {
      setDivision("");
      setFullName("");
      setEmail("");
    }
  };

  React.useEffect(() => {
    handleAssetAutoFill();
  }, [assetId]);

  React.useEffect(() => {
    handleEmployeeAutoFill();
  }, [employeeId]);

  return (
    <div className="form-container">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="device">Device</label>
          <select
            id="device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            <option value="">Value</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
          </select>
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
            <i className="fas fa-search search-icon"></i>
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
            value={deviceName}
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
                <span class="material-symbols-outlined">keyboard_command_key</span>
                <label className="status-label">{conditionStatus}</label>
            </div>
            <div className="status-label">
                <span class="material-symbols-outlined">keyboard_command_key</span>
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
          <label htmlFor="employeeSearch">Search by employee id</label>
          <div className="search-container">
            <input
              id="employeeSearch"
              type="text"
              placeholder="Search by employee id"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i>
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
        <button type="button" className="handover-btn">
          Handover
        </button>
        <button type="button" className="transfer-btn">
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TransferHandover;
