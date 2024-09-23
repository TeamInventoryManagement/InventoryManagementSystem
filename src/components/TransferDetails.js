import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const columns = [
  { field: 'TransferID', headerName: 'Transfer ID', width: 70 },
  { field: 'AssetID', headerName: 'Asset ID', width: 70 },
  { field: 'Device', headerName: 'Device', width: 130 },
  { field: 'DeviceBrand', headerName: 'Device Brand', width: 130 },
  { field: 'Model', headerName: 'Model', width: 130 },
  { field: 'SerialNumber', headerName: 'Serial Number', width: 130 },
  { field: 'ConditionStatus', headerName: 'Condition Status', width: 130 },  
  { field: 'EmployeeID', headerName: 'Employee ID', width: 130 },  
  { field: 'FullName', headerName: 'Employee Name', width: 130 },  
  { field: 'Division', headerName: 'Division', width: 130 }, 
  { field: 'IssueDate', headerName: 'Issue Date', width: 130 }, 
  { field: 'HandoverDate', headerName: 'Handover Date', width: 130 }, 

   { 
    field: 'CurrentStatus', 
    headerName: 'Current Status', 
    width: 130,
    renderCell: (params) => {
      let color = 'black'; // default color
      if (params.value === 'In-Use') {
        color = 'green';
      } else if (params.value === 'Handover') {
        color = 'red';
      }

      return (
        <span style={{
          color: color,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {params.value}
        </span>
      );
    }  
  },  
];

export default function TransferDevices() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    fetch('http://localhost:3000/api/TransferDevices')
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of device details
        console.log('Fetched data:', data); // Log the fetched data
        setRows(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.TransferID} // Use AssetID as the unique identifier
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10]}
        sx={{ overflow: 'clip' }}
      />
    </div>
  );
}