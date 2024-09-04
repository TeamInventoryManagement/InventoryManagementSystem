import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import ColorChips from './Chips.js'; //

const columns = [
  { field: 'AssetID', headerName: 'Asset ID', width: 70 },
  { field: 'Device', headerName: 'Device', width: 130 },
  { field: 'DeviceBrand', headerName: 'Device Brand', width: 130 },
  { field: 'Model', headerName: 'Model', width: 130 },
  { field: 'SerialNumber', headerName: 'Serial Number', width: 130 },
  { field: 'ConditionStatus', headerName: 'Condition Status', width: 130 },  
  { 
    field: 'CurrentStatus', 
    headerName: 'Current Status', 
    width: 130,
    renderCell: (params) => {
    /*  let color = 'black'; // default color
      if (params.value === 'In-Use') {
        color = 'green';
      } else if (params.value === 'In-Stock') {
        color = 'blue';
      } */

      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ColorChips label={params.value} />
        </div>
      );
    }  
  },  
];

export default function InUseDevice() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    fetch('http://localhost:3000/api/InUse')
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
        getRowId={(row) => row.AssetID} // Use AssetID as the unique identifier
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



 