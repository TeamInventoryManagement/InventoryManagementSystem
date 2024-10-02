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
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


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
  const [selectedHandoverComponents, setSelectedHandoverComponents] = useState([]);


  useEffect(() => {
    if (assetId) {
      fetch(`http://localhost:3000/api/handover/${assetId}`)
        .then(response => response.json())
        .then(data => {
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
        .catch(error => console.error('Error fetching transfer details:', error));
    }
  }, [assetId]);

  const resetForm = () => {
    setAssetId("");
    setDevice("");
    setDeviceBrand("");
    setModel("");
    setSerialNumber("");
    setConditionStatus("Condition Status");
    setCurrentStatus("Status");
    setEmployeeId("");
    setDivision("");
    setFullName("");
    setEmail("");
  };

  const handleComponentChange = (event) => {
    const { name, checked } = event.target;
  
    setSelectedHandoverComponents(prev => {
      if (checked && !prev.includes(name)) {
        return [...prev, name];
      } else {
        return prev.filter(item => item !== name);
      }
    });
  };
  

  const handleHandover = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          currentStatus: 'Handover',
          handoverDate: new Date().toISOString().split('T')[0],
          laptopHandoverComponents: selectedHandoverComponents, 
        }),
      });

  //     if (response.ok) {
  //       alert('Handover successful!');
  //       resetForm(); // Reset the form after successful handover
  //     } else {
  //       const errorData = await response.json();
  //       alert('Error: ' + errorData.error);
  //     }
  //   } catch (error) {
  //     console.error('Error during handover:', error);
  //     alert('An error occurred: ' + error.message);
  //   }
  // };

          // Show initial toast and save the ID
          const toastId = toast.loading("Checking Details...", { position: "top-center" });
            
          // After a delay of 1 second, update the toast based on the response
          setTimeout(() => {
              if (response.ok) {
                  toast.update(toastId, {
                      render: "Handover successful!", 
                      type: "success", 
                      isLoading: false, 
                      autoClose: 2000, 
                      closeOnClick: true
                  });
                  resetForm();
              } else {
                  toast.update(toastId, {
                      render: "Failed to Handover Device", 
                      type: "error", 
                      isLoading: false, 
                      autoClose: 2000,
                      closeOnClick: true
                  });
              }
          }, 1000); 

          } catch (error) {
                console.error('Error during handover:', error);
                toast.error("An error occurred. Please try again", { position: "top-center" });
          }
        };

  return (
    <div className="form-container" >
    {/* First Line: Asset ID Search Bar */}
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

      <div className="form-group">
        <label>Laptop Components</label>
        <div className="checkComponents">
          <Checkbox
            checked={selectedHandoverComponents.includes("Bag")}
            onChange={handleComponentChange}
            name="Bag"
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
          /> Bag
          <Checkbox
            checked={selectedHandoverComponents.includes("Charger")}
            onChange={handleComponentChange}
            name="Charger"
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
          /> Charger
        </div>
      </div>

        <ButtonGroup
                variant="outlined"
                aria-label="Loading button group"
                style={{ marginTop: '-1200px' ,marginLeft:'500px'}}>
                <Button onClick={handleHandover}>Handover Device</Button>
                <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>Save</LoadingButton>
        </ButtonGroup>
        <ToastContainer />
    </div>
  );
};

export default Handover;