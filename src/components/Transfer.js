import React, { useState, useEffect } from "react";
import "./TransferHandover.css";
import searchIcon from './images/Search_icon.png';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ColorChips from "./Chips.js";
import { useLocation } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const Transfer = () => {
  const [device, setDevice] = useState("");
  const [assetId, setAssetId] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [bitLockerKey, setBitLockerKey] = useState("");
  const [conditionStatus, setConditionStatus] = useState("Condition Status");
  const [currentStatus, setCurrentStatus] = useState("Status");

  const [employeeId, setEmployeeId] = useState("");
  const [division, setDivision] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();
  const [selectedTransferComponents, setSelectedTransferComponents] = useState([]);




  useEffect(() => {
    if (assetId) {
      fetchDeviceDetails(assetId);
    }
  }, [assetId]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  useEffect(() => {
    if (location.state && location.state.assetID) {
      setAssetId(location.state.assetID); // Set assetId when page loads
    }
  }, [location.state]);

  const fetchDeviceDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/devices/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch device details: ${response.statusText}`);
      }
      const data = await response.json();
      setDevice(data.Device);
      setDeviceBrand(data.DeviceBrand);
      setModel(data.Model);
      setSerialNumber(data.SerialNumber);
      setBitLockerKey(data.BitLockerKey);
      setConditionStatus(data.ConditionStatus);
      setCurrentStatus(data.CurrentStatus);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch employee details: ${response.statusText}`);
      }
      const data = await response.json();
      setDivision(data.Division);
      setFullName(data.FullName);
      setEmail(data.Email);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  // Function to handle changes in checkbox selection
const handleComponentChange = (event) => {
  const { name, checked } = event.target;
  setSelectedTransferComponents(prev =>
    checked
      ? [...prev, name]
      : prev.filter(transferComponents => transferComponents !== name)
  );
};

  const resetForm = () => {
    setDevice("");
    setAssetId("");
    setDeviceBrand("");
    setModel("");
    setSerialNumber("");
    setBitLockerKey("");
    setConditionStatus("Condition Status");
    setCurrentStatus("Status");
    setEmployeeId("");
    setDivision("");
    setFullName("");
    setEmail("");
  };

  const handleTransfer = async () => {
    const transferData = {
      assetId,
      device,
      deviceBrand,
      model,
      serialNumber,
      bitLockerKey,
      conditionStatus,
      currentStatus,
      employeeId,
      division,
      fullName,
      email,
      selectedTransferComponents,
      issueDate: new Date().toISOString().split('T')[0],
      handoverDate: null
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



        // Show initial toast and save the ID
          const toastId = toast.loading("Checking Details...", { position: "top-center" });
            
          // After a delay of 1 second, update the toast based on the response
          setTimeout(() => {
              if (response.ok) {
                  toast.update(toastId, {
                      render: "Transfer successful!", 
                      type: "success", 
                      isLoading: false, 
                      autoClose: 2000, 
                      closeOnClick: true
                  });
                  resetForm();
              } else {
                  toast.update(toastId, {
                      render: data.error || "Failed to transfer device", 
                      type: "error", 
                      isLoading: false, 
                      autoClose: 2000,
                      closeOnClick: true
                  });
              }
          }, 1000); 

          } catch (error) {
                console.error('Error during transfer:', error);
                toast.error("An error occurred. Please try again", { position: "top-center" });
          }
        };


  return (
    <div className="form-container" >
 
    <div className="form-row">
     
      <div className="form-group" >
        <label htmlFor="assetSearch">Search by Asset ID</label>
        <div className="search-container" >
          <input
            id="assetSearch"
            type="text"
            placeholder="Search by asset id"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />
        </div>
 
       
      </div>
     
      <button type="submit" className="search-button" style={{ width: '20px', height: '20px', marginRight: '810px', position: 'relative', top: '28px' }}>
        <img
          src={searchIcon}
          alt="Search"
          style={{ width: '20px', height: '20px', marginLeft: '250px', position: 'relative', top: '-120px' }}
        />
      </button>
     
 
      </div>
     
 
    {/* Second Line: Device Dropdown and Asset ID */}
    <div className="form-row" style={{ marginTop: '-50px' }}>
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
 
    {/* Third Line: Device Name */}
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
          <div>
            <ColorChips label={conditionStatus} />
          </div>
          <div>
          <ColorChips label={currentStatus} />
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bitLockerKey">BitLocker Key</label>
          <input
            id="bitLockerKey"
            type="text"
            placeholder="Enter BitLocker Key"
            value={bitLockerKey}
            onChange={(e) => setBitLockerKey(e.target.value)}
            required
          />
        </div>
      </div>
      <ToastContainer />


      <div className="form-group" >
        <ButtonGroup
                variant="outlined"
                aria-label="Loading button group"
                style={{ marginTop: '-1027px' ,marginLeft:'550px'}}>
                <Button onClick={handleTransfer} >Transfer Device</Button>
                <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>
                Save
                </LoadingButton>
        </ButtonGroup>
        </div>

        
      <div className="form-group">
        <label>Laptop Components</label>
        <div className="checkComponents">
          <Checkbox
            checked={selectedTransferComponents.includes("Bag")}
            onChange={handleComponentChange}
            name="Bag"
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
          /> Bag
          <Checkbox
            checked={selectedTransferComponents.includes("Charger")}
            onChange={handleComponentChange}
            name="Charger"
            icon={<CheckBoxOutlineBlankIcon  />}
            checkedIcon={<CheckBoxIcon />}
          /> Charger
        </div>
      </div>
        
      
    </div>
  );
};

export default Transfer;