import React, { useState } from 'react';
import './LaptopDetails.css';
import searchIcon from './images/Search_icon.png';

const LaptopDetails = () => {
    const [formData, setFormData] = useState({
        device: 'Laptop', // Hardcoded value for device
        deviceBrand: '',
        model: '',
        assetId: '',
        processor: '',
        laptopId: '',
        installedRam: '',
        serialNumber: '',
        systemType: '',
        invoiceNumber: '',
        purchasedDate: '',
        purchasedAmount: '',
        warentyMonths: '',
        address: ''
    });

    const [searchAssetId, setSearchAssetId] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearchChange = (e) => {
        setSearchAssetId(e.target.value);

        // If the Asset ID field is cleared, reset the form
        if (e.target.value === '') {
            resetFormData();
        }
    };

    const handleSearchClick = async () => {
        if (!searchAssetId) {
            alert("Please enter an Asset ID to search.");
            return;
        }

        try {
            console.log(`Fetching details for Asset ID: ${searchAssetId}`);
            const response = await fetch(`http://localhost:3000/api/laptop/${searchAssetId}`);

            if (!response.ok) {
                // Check if the response is HTML instead of JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("text/html")) {
                    throw new Error('Received HTML instead of JSON');
                }

                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(errorData.error || 'Unknown error occurred');
            }

            const data = await response.json();
            console.log('Received data:', data); // Log the received data
            setFormData({
                device: data.Device || '',
                deviceBrand: data.DeviceBrand || '',
                model: data.Model || '',
                assetId: data.AssetID || '',
                processor: data.Processor || '',
                laptopId: data.LaptopId || '',
                installedRam: data.InstalledRAM || '',
                serialNumber: data.SerialNumber || '',
                systemType: data.SystemType || '',
                invoiceNumber: data.InvoiceNumber || '',
                purchasedDate: data.PurchaseDate ? data.PurchaseDate.split('T')[0] : '',
                purchasedAmount: data.PurchaseAmount || '',
                warentyMonths: data.WarentyMonths || '',
                address: data.Address || '',
            });

        } catch (error) {
            console.error('Error fetching device:', error.message);
            alert('An error occurred while fetching the device details: ' + error.message);
        }
    };

    const resetFormData = () => {
        setFormData({
            device: 'Laptop',
            deviceBrand: '',
            model: '',
            assetId: '',
            processor: '',
            laptopId: '',
            installedRam: '',
            serialNumber: '',
            systemType: '',
            invoiceNumber: '',
            purchasedDate: '',
            purchasedAmount: '',
            warentyMonths: '',
            address: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Submitting form data:', formData);
            const response = await fetch('http://localhost:3000/api/LaptopDetails', {
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
                console.error('Error response:', data);
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
                    <input
                        type="text"
                        placeholder="Search by Asset ID"
                        className="search-bar"
                        value={searchAssetId}
                        onChange={handleSearchChange}
                    />
                    <button type="button" className="search-button" onClick={handleSearchClick}>
                        <img src={searchIcon} alt="Search" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>
            </div>

            <h2>Device Specifications</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Asset ID</label>
                        <input type="text" name="assetId" placeholder="Asset ID" onChange={handleChange} value={formData.assetId} />
                    </div>
                </div>
               
                <div className="form-row">
                    <div className="form-group">
                        <label>Brand</label>
                        <input type="text" name="deviceBrand" placeholder="Device Brand" onChange={handleChange} value={formData.deviceBrand} />
                    </div>
                    <div className="form-group">
                        <label>Model</label>
                        <input type="text" name="model" placeholder="Model" onChange={handleChange} value={formData.model} />
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
                        <label>Laptop ID (Device ID)</label>
                        <input type="text" name="laptopId" placeholder="Laptop ID" onChange={handleChange} value={formData.laptopId} />
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

                <div className="form-row">
                    <div className="form-group">
                        <label>Warranty Period (Months)</label>
                        <input type="number" name="warentyMonths" placeholder="Warranty Months" onChange={handleChange} value={formData.warentyMonths} />
                    </div>
                </div>

                <button type="submit" className="submit-btn1">Submit</button>
            </form>
        </div>
    );
};

export default LaptopDetails;
