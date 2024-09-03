import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
/*
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function InUseDevice() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ overflow: 'clip' }}
      />
    </div>
  );
};
*/

const columns = [
  { field: 'AssetID', headerName: 'Asset ID', width: 70 },
  { field: 'Device', headerName: 'Device', width: 130 },
  { field: 'DeviceBrand', headerName: 'Device Brand', width: 130 },
  { field: 'Model', headerName: 'Model', width: 130 },
  { field: 'SerialNumber', headerName: 'Serial Number', width: 130 },
  { field: 'ConditionStatus', headerName: 'Condition Status', width: 130 },  
 /* { field: 'CurrentStatus', headerName: 'Current Status', width: 130
    ,renderCell: (params) => (
      <span style={{
        color: 'green',
        //border: '1px solid green',
        //borderRadius: '5px',
        //padding: '2px 5px',
        //display: 'inline-block',
        fontWeight: 'bold',
        textAlign: 'center'
        //width: '100%',
      }}>
        {params.value}
      </span>
    )  
   }, */
   { 
    field: 'CurrentStatus', 
    headerName: 'Current Status', 
    width: 130,
    renderCell: (params) => {
      let color = 'black'; // default color
      if (params.value === 'In-Use') {
        color = 'green';
      } else if (params.value === 'In-Stock') {
        color = 'blue';
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

export default function InUseDevice() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    fetch('/api/InUse')
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