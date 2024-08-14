import React, { useState } from 'react';
import './LaptopDetails.css';

const Dashboard = () => {
    const [formData, setFormData] = useState({
        device: '',
        model: '',
        fullName: '',
        assetId: '',
        processor: '',
        deviceId: '',
        installedRam: '',
        serialNumber: '',
        systemType: '',
        invoiceNumber: '',
        purchasedDate: '',
        purchasedFrom: '',
        purchasedAmount: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
      <div className="form-container">
      <div className="header">
          <div className="search-container">
          <i className="fas fa-search search-icon"></i>
              <input 
                  type="text" 
                  placeholder="Search by Asset ID" 
                  className="search-bar" 
                  onChange={handleChange} 
                  name="search" 
              />
              <i className="fas fa-search search-icon"></i>
          </div>
          <button className="btn new-btn">New</button>
          {/* <button className="btn delete-btn">Delete device</button> */}
      </div>
            <h2>Device Specifications</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Device</label>
                        <select name="device" onChange={handleChange} value={formData.device}>
                            <option value="">Select Device</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Model</label>
                        <input type="text" name="model" placeholder="Model" onChange={handleChange} value={formData.model} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Full device name</label>
                        <input type="text" name="fullName" placeholder="Full device name" onChange={handleChange} value={formData.fullName} />
                    </div>
                    <div className="form-group">
                        <label>Asset ID</label>
                        <input type="text" name="assetId" placeholder="Asset ID" onChange={handleChange} value={formData.assetId} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Processor</label>
                        <input type="text" name="processor" placeholder="Processor" onChange={handleChange} value={formData.processor} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Device ID</label>
                        <input type="text" name="deviceId" placeholder="Device ID" onChange={handleChange} value={formData.deviceId} />
                    </div>
                    <div className="form-group">
                        <label>Installed RAM</label>
                        <input type="text" name="installedRam" placeholder="Installed RAM" onChange={handleChange} value={formData.installedRam} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Serial Number</label>
                        <input type="text" name="serialNumber" placeholder="Serial Number" onChange={handleChange} value={formData.serialNumber} />
                    </div>
                    <div className="form-group">
                        <label>System type (OS)</label>
                        <input type="text" name="systemType" placeholder="System type (OS)" onChange={handleChange} value={formData.systemType} />
                    </div>
                </div>

                <h2>Billing Details</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label>Invoice Number</label>
                        <input type="text" name="invoiceNumber" placeholder="Invoice Number" onChange={handleChange} value={formData.invoiceNumber} />
                    </div>
                    <div className="form-group">
                        <label>Purchased Date</label>
                        <input type="date" name="purchasedDate" onChange={handleChange} value={formData.purchasedDate} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Purchased from</label>
                        <input type="text" name="purchasedFrom" placeholder="Purchased from" onChange={handleChange} value={formData.purchasedFrom} />
                    </div>
                    <div className="form-group">
                        <label>Purchased Amount</label>
                        <input type="text" name="purchasedAmount" placeholder="Purchased Amount" onChange={handleChange} value={formData.purchasedAmount} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address" placeholder="Address" className="full-width" onChange={handleChange} value={formData.address} />
                    </div>
                </div>
                <button type="submit" className="btn submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default Dashboard;
