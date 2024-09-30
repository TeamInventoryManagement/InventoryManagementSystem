import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import ColorChips from './Chips.js'; //
import { Chip } from '@mui/material';

const columns = [
  { field: 'AssetID', headerName: 'Asset ID', width: 150 },
  { field: 'Device', headerName: 'Device', width: 130 },
  { field: 'DeviceBrand', headerName: 'Device Brand', width: 130 },
  { field: 'Model', headerName: 'Model', width: 130 },
  { field: 'SerialNumber', headerName: 'Serial Number', width: 160 },
  { field: 'DeviceAge', headerName: 'Device Age', width: 160 },
  { field: 'ConditionStatus', headerName: 'Condition Status', width: 180 ,
    renderCell: (params) => {
      let statuslabel = 'default';
      //const [labelstatus, setstatuslabel] = useState(null);
        if (params.value === 'Good-Condition') {
          statuslabel = 'success';
          //setstatuslabel(statuslabel)
        } else if (params.value === 'Issue-Identified') {
          statuslabel = 'warning';
        }  else if (params.value === 'Send-to-Repair') {
          statuslabel = 'secondary';
        } else if (params.value === 'Disposal') {
          statuslabel = 'error';
        } 
        return (
            <Chip variant="outlined" size="small" color={statuslabel} label={params.value} />
        );
      }  
  },  
  { 
    field: 'CurrentStatus', 
    headerName: 'Current Status', 
    width: 130,
    renderCell: (params) => {

        let statuslabel = 'default';
        //const [labelstatus, setstatuslabel] = useState(null);
          if (params.value === 'In-Use') {
            statuslabel = 'success';
            //setstatuslabel(statuslabel)
          } else if (params.value === 'In-Stock') {
            statuslabel = 'primary';
          } else if (params.value === 'Disposal') {
            statuslabel = 'error';
          } 
      return (
        <Chip variant="outlined" size="small" color={statuslabel} label={params.value} />
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



 