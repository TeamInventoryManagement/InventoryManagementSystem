import React, { useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
//import './LaptopDetails.css';
import { useNavigate } from 'react-router-dom';
 
function DeviceSearch() {
  const [searchParams, setSearchParams] = useState({
    DeviceBrand: '',
    InstalledRAM: '',
    Model: '',
    Processor: '',
    CurrentStatus:'',
    AgeInYears:''
  });
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Reset error message
    setResults([]);  // Reset results
 
    try {
      const response = await axios.post('http://localhost:3000/api/search1', searchParams);
      setResults(response.data);
    } catch (error) {
      console.log("Error:", error.response);  // Log the error response for debugging
      if (error.response && error.response.status === 404) {
        setErrorMessage('No matching records found');
      } else {
        setErrorMessage('Error fetching data');
      }
    }
  };
 
  const handleAssignDevice = (assetID) => {
    // Redirect to the Transfer page with the AssetID passed as state
    navigate("/TransferPage", { state: { assetID } });
  };
 
 
  const columns = [
    { field: 'AssetID', headerName: 'Asset ID', width: 100 },
    { field: 'DeviceBrand', headerName: 'Device Brand', width: 110 },
    { field: 'Model', headerName: 'Model', width: 130 },
    { field: 'Processor', headerName: 'Processor', width: 240},
    { field: 'InstalledRAM', headerName: 'RAM', width: 110 },
    { field: 'CurrentStatus', headerName: 'CurrentStatus', width: 120 },
    { field: 'AgeInYears', headerName: 'AgeInYears', width: 110 },,
    {
      field: 'Action',
      headerName: 'Tranfer',
      width: 110,
      renderCell: (params) => (
        <button
        onClick={() => handleAssignDevice(params.row.AssetID)}
      >Transfer
       
        </button>
      ),
    },
  ];
 
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-group">
        <div className="form-group">
          <label>Device Brand</label>
          <input
            type="text"
            name="DeviceBrand"
            placeholder="Device Brand"
            value={searchParams.DeviceBrand}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Installed RAM</label>
          <input
            type="text"
            name="InstalledRAM"
            placeholder="Installed RAM"
            value={searchParams.InstalledRAM}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="Model"
            placeholder="Model"
            value={searchParams.Model}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Processor</label>
          <input
            type="text"
            name="Processor"
            placeholder="Processor"
            value={searchParams.Processor}
            onChange={handleChange}
          />
        </div>
        <br/>
        <button type="submit" className="submit-btn1">Search</button>
      </form>
 
      {errorMessage && <p>{errorMessage}</p>}  {/* Display error message */}
 
 <br></br>
      {results.length === 0 && !errorMessage ? (
        <p>No results yet</p>
      ) : (
        <div style={{ height: 400, width: '130%' }}>
          <DataGrid
            rows={results}
            columns={columns}
            getRowId={(row) => row.AssetID}  // Unique identifier
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </div>
      )}
    </div>
  );
}
 
export default DeviceSearch;
 