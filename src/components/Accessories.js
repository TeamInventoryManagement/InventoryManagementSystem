import React, { useState } from 'react';
import './StyleSheet.css';
import searchIcon from './images/Search_icon.png';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionAlerts from "./Alerts.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const Accessories = () => {
    const [formData, setFormData] = useState({
            deviceBrand: '',
            model: '',
            assetId: '',
            accessoriesType: '',
            deviceId: '',
            serialNumber: '',
            invoiceNumber: '',
            purchaseDate: '',
            purchaseCompany: '',
            purchasedAmount: '',
            warentyMonths: ''
    });
 
 
   
    const [searchAssetId, setSearchAssetId] = useState('');
    const [assetIdSearched, setAssetIdSearched] = useState(false);
    const [alert, setAlert] = useState({ severity: '', title: '', message: '' });
 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
 
    const handleSearchChange = (e) => {
        setSearchAssetId(e.target.value);
        setAssetIdSearched(false);
 
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
            const response = await fetch(`http://localhost:3000/api/accessories/${searchAssetId}`);
 
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
                accessoriesType: data.AssetType|| '',
                deviceBrand: data.DeviceBrand || '',
                model: data.Model || '',
                assetId: data.AssetID || '',
                deviceId: data.DeviceId || '',
                serialNumber: data.SerialNumber || '',
                invoiceNumber: data.InvoiceNumber || '',
                purchaseDate: data.PurchaseDate ? data.PurchaseDate.split('T')[0] : '',
                purchaseCompany: data.PurchaseCompany || '',
                purchasedAmount: data.PurchaseAmount || '',
                warentyMonths: data.WarentyMonths || '',
            });
            setAssetIdSearched(true);
 
        } catch (error) {
            console.error('Error fetching device:', error.message);
            toast.success('An error occurred while fetching the device details: ' + error.message, {position: "top-center"});
            //alert('An error occurred while fetching the device details: ' + error.message);
        }
    };
 
    const resetFormData = () => {
        setFormData({
            deviceBrand: '',
            model: '',
            assetId: '',
            accessoriesType: '',
            deviceId: '',
            serialNumber: '',
            invoiceNumber: '',
            purchaseDate: '',
            purchaseCompany: '',
            purchasedAmount: '',
            warentyMonths: ''
        });
        setSearchAssetId('');
        setAssetIdSearched(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            console.log('Submitting form data:', formData);
            const response = await fetch('http://localhost:3000/api/accessories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
 
            const data = await response.json();
            if (response.ok) {
                toast.success("Device Added successfully", {position: "top-center"});
                //alert(data.message);
                resetFormData(); // Reset the form after a successful submission
            } else {
                console.error('Error response:', data);
                toast.success("Device Added successfully", {position: "top-center"});
                //alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.success("Device Added successfully", {position: "top-center"});
            //alert('An error occurred. Please try again.');
        }
    };
 

        const resetBulkFormData = (excludeFields = []) => {
        const defaultData = {
            deviceBrand: formData.deviceBrand,
            model: formData.model,
            assetId: '',
            accessoriesType: formData.accessoriesType,
            deviceId: '',
            serialNumber: '',
            invoiceNumber: formData.invoiceNumber,
            purchaseDate: formData.purchaseDate,
            purchaseCompany: formData.purchaseCompany,
            purchasedAmount: formData.purchasedAmount,
            warentyMonths: formData.warentyMonths
        };
    
        // Only reset fields that are not in the excludeFields array
        const newFormData = { ...formData };
        for (const key in defaultData) {
            if (!excludeFields.includes(key)) {
                newFormData[key] = defaultData[key];
            }
        }
        setFormData(newFormData);
        setSearchAssetId('');
        setAssetIdSearched(false);
    };
    
    const handleBulkData = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/accessories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Device Added successfully", {position: "top-center"});
                //setAlert({ severity: 'success', title: 'Success', message: 'Device Added successfully' });
                resetBulkFormData(['serialNumber']); // Exclude serialNumber from resetting
            } else {
                toast.success(data.error, {position: "top-center"});
                //setAlert({ severity: 'error', title: 'Error', message: data.error });
            }
        } catch (error) {
            toast.success("An error occurred. Please try again", {position: "top-center"});
            //setAlert({ severity: 'error', title: 'Error', message: 'An error occurred. Please try again' });
        }
    };
 
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/AccessoriesUpdate', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            // Show initial toast and save the ID
            const toastId = toast.loading("Updating device...", { position: "top-center" });
    
            // After a delay of 1 second, update the toast based on the response
            setTimeout(() => {
                if (response.ok) {
                    toast.update(toastId, {
                        render: "Device Updated successfully", // Message to display
                        type: "success", // Change the type to success
                        isLoading: false, // Stop showing the loading spinner
                        autoClose: 5000, // Auto-close after 5 seconds
                        closeOnClick: true
                    });
                    resetFormData();
                } else {
                    toast.update(toastId, {
                        render: data.error || "Failed to update device", 
                        type: "error", 
                        isLoading: false,
                        autoClose: 5000,
                        closeOnClick: true
                    });
                }
            }, 1000); // 1 second delay (1000 ms)

        } catch (error) {
            toast.success("An error occurred. Please try again", {position: "top-center"});
            //setAlert({ severity: 'error', title: 'Error', message: 'An error occurred. Please try again' });
        }
    };
 
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/AccessoriesDelete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId: formData.assetId })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Deleted Accessories Details Successfully", {position: "top-center"});
                //setAlert({ severity: 'success', title: 'Success', message: 'Deleted Accessories Details Successfully' });
                resetFormData();
            } else {
                toast.success("data.error", {position: "top-center"});
                //setAlert({ severity: 'error', title: 'Error', message: data.error });
            }
        } catch (error) {
            toast.success("An error occurred. Please try again", {position: "top-center"});
            //setAlert({ severity: 'error', title: 'Error', message: 'An error occurred. Please try again' });
        }
    };
 
   
 
    return (
        <div>
            <div>
                {alert.message && (
                <DescriptionAlerts
                severity={alert.severity}
                title={alert.title}
                message={alert.message} />)}
            </div>
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
       
                <ButtonGroup variant="outlined" aria-label="Loading button group">
                <Button onClick={handleSubmit}>+ Add</Button>
                <Button onClick={handleBulkData}>++ Add Bulk</Button>
                <Button onClick={handleUpdate}>! Update</Button>
                <Button onClick={handleDelete}>- Delete</Button>
                <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}>
                Save
                </LoadingButton>
                </ButtonGroup>
            </div>
            <h2>Accessories</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Accessory Type</label>
                        <select name="accessoriesType" placeholder="Select Type" onChange={handleChange} value={formData.accessoriesType}>
                            <option value="Select Type">Select Type</option>\
                            <option value="Keyboard">Keyboard</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Dongle">Dongle</option>
                        </select>
                    </div>
 
                    <div className="form-group">
                        <label>Asset ID</label>
                        <input type="text" name="assetId" placeholder="Asset ID" onChange={handleChange} value={formData.assetId} disabled={assetIdSearched} />
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
                    <label>Accesories ID (Device ID)</label>
                    <input type="text" name="deviceId" placeholder="Accesories ID" onChange={handleChange} value={formData.deviceId} />
                    </div>

                    <div className="form-group">
                        <label>Serial Number</label>
                        <input type="text" name="serialNumber" placeholder="Serial Number" onChange={handleChange} value={formData.serialNumber} />
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
                        <input type="date" name="purchaseDate" onChange={handleChange} value={formData.purchaseDate} />
                    </div>
                </div>
 
                <div className="form-row">
                <div className="form-group">
                        <label>Purchased Company</label>
                        <input type="text" name="purchaseCompany" placeholder="Purchased Company" onChange={handleChange} value={formData.purchaseCompany} />
                    </div>
                    <div className="form-group">
                        <label>Purchased Amount</label>
                        <input type="text" name="purchasedAmount" placeholder="Purchased Amount" onChange={handleChange} value={formData.purchasedAmount} />
                    </div>
                </div>
 
                <div className="form-row">
                    <div className="form-group">
                        <label>Warranty Period (Months)</label>
                        <input type="number" name="warentyMonths" placeholder="Warranty Months" onChange={handleChange} value={formData.warentyMonths} />
                    </div>
                </div>
                <ToastContainer />
            </form>
        </div>
        </div>
    );
};
 
export default Accessories;