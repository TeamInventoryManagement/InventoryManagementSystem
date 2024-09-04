import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';

const columns = [
  { field: 'device', headerName: 'device', width: 70 },
  { field: 'TotalDeviceCount', headerName: 'TotalDeviceCount', width: 130 },
  { field: 'InstockCount', headerName: 'InstockCount', width: 130 },
  { field: 'InUseCount', headerName: 'InUseCount', width: 130 },
  { field: 'InstockGoodCount', headerName: 'InstockGoodCount', width: 130 },
  { field: 'InstockFairCount', headerName: 'InstockFairCount', width: 130 }, 
  { field: 'InUseGoodCount', headerName: 'InUseGoodCount', width: 130 },    
  { field: 'InUseFairCount', headerName: 'InUseFairCount', width: 130 },       
];

export default function Inventory() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    fetch('http://localhost:3000/api/Inventory')
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
        getRowId={(row) => row.device}
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



 