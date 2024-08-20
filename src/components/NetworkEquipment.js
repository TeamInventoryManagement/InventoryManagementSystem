import React, { useState } from "react";
import "./NetworkEquipment.css";
 
const NetworkEquipment = () => {
  const [deviceType, setDeviceType] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [assetId, setAssetId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState("");
 
  const [macAddress, setMacAddress] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [gateway, setGateway] = useState("");
  const [dnsServers, setDnsServers] = useState("");
  const [vlanId, setVlanId] = useState("");
 
  const [firmwareVersion, setFirmwareVersion] = useState("");
  const [configurationBackup, setConfigurationBackup] = useState(null);
  const [loginCredentials, setLoginCredentials] = useState("");
  const [portConfiguration, setPortConfiguration] = useState("");
 
  const [rackLocation, setRackLocation] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [installedBy, setInstalledBy] = useState("");
 
  const [operationalStatus, setOperationalStatus] = useState("");
  const [powerStatus, setPowerStatus] = useState("");
  const [uptime, setUptime] = useState("");
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState("");
 
  const [notes, setNotes] = useState("");
  const [documentation, setDocumentation] = useState(null);
 
  const handleSave = () => {
    // Logic to save the network equipment data
    alert("Network Equipment data saved successfully!");
  };
 
  const handleReset = () => {
    // Logic to reset all form fields
    setDeviceType("");
    setModel("");
    setManufacturer("");
    setSerialNumber("");
    setAssetId("");
    setPurchaseDate("");
    setWarrantyExpiryDate("");
    setMacAddress("");
    setIpAddress("");
    setSubnetMask("");
    setGateway("");
    setDnsServers("");
    setVlanId("");
    setFirmwareVersion("");
    setConfigurationBackup(null);
    setLoginCredentials("");
    setPortConfiguration("");
    setRackLocation("");
    setPhysicalAddress("");
    setInstalledBy("");
    setOperationalStatus("");
    setPowerStatus("");
    setUptime("");
    setLastMaintenanceDate("");
    setNotes("");
    setDocumentation(null);
  };
 
  return (
    <div className="form-container">
      <h2>Network Equipment</h2>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="deviceType">Device Type</label>
          <select
            id="deviceType"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
          >
            <option value="">Select Device Type</option>
            <option value="Router">Router</option>
            <option value="Switch">Switch</option>
            <option value="Firewall">Firewall</option>
            <option value="Access Point">Access Point</option>
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
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="warrantyExpiryDate">Warranty Expiry Date</label>
          <input
            id="warrantyExpiryDate"
            type="date"
            value={warrantyExpiryDate}
            onChange={(e) => setWarrantyExpiryDate(e.target.value)}
          />
        </div>
      </div>
 
      <h3>Network Information</h3>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="macAddress">MAC Address</label>
          <input
            id="macAddress"
            type="text"
            placeholder="MAC Address"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ipAddress">IP Address</label>
          <input
            id="ipAddress"
            type="text"
            placeholder="IP Address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subnetMask">Subnet Mask</label>
          <input
            id="subnetMask"
            type="text"
            placeholder="Subnet Mask"
            value={subnetMask}
            onChange={(e) => setSubnetMask(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gateway">Gateway</label>
          <input
            id="gateway"
            type="text"
            placeholder="Gateway"
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dnsServers">DNS Servers</label>
          <input
            id="dnsServers"
            type="text"
            placeholder="DNS Servers"
            value={dnsServers}
            onChange={(e) => setDnsServers(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vlanId">VLAN ID</label>
          <input
            id="vlanId"
            type="text"
            placeholder="VLAN ID"
            value={vlanId}
            onChange={(e) => setVlanId(e.target.value)}
          />
        </div>
      </div>
 
      <h3>Configuration Information</h3>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firmwareVersion">Firmware Version</label>
          <input
            id="firmwareVersion"
            type="text"
            placeholder="Firmware Version"
            value={firmwareVersion}
            onChange={(e) => setFirmwareVersion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="configurationBackup">Configuration Backup</label>
          <input
            id="configurationBackup"
            type="file"
            onChange={(e) => setConfigurationBackup(e.target.files[0])}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="loginCredentials">Login Credentials</label>
          <input
            id="loginCredentials"
            type="password"
            placeholder="Login Credentials"
            value={loginCredentials}
            onChange={(e) => setLoginCredentials(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="portConfiguration">Port Configuration</label>
          <textarea
            id="portConfiguration"
            placeholder="Port Configuration"
            value={portConfiguration}
            onChange={(e) => setPortConfiguration(e.target.value)}
          ></textarea>
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="powerStatus">Power Status</label>
          <select
            id="powerStatus"
            value={powerStatus}
            onChange={(e) => setPowerStatus(e.target.value)}
          >
            <option value="">Select Power Status</option>
            <option value="On">On</option>
            <option value="Off">Off</option>
            <option value="Standby">Standby</option>
          </select>
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="uptime">Uptime</label>
          <input
            id="uptime"
            type="text"
            placeholder="Uptime"
            value={uptime}
            onChange={(e) => setUptime(e.target.value)}
          />
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
        <button type="button" className="handover-btn">
          Save
        </button>
        <button type="button" className="transfer-btn">
          Reset
        </button>
      </div>
    </div>
  );
};
 
export default NetworkEquipment;