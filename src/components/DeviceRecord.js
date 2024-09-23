import React, { useEffect, useRef, useState } from 'react';
import { TextField, Stack, Typography, CardContent, Card, Autocomplete, Chip } from '@mui/material';
import axios from 'axios'; // For making API requests
import ColorChips from './Chips';
import { ToastContainer } from 'react-toastify';

const DeviceRecord = () => {
  const [searchParams, setSearchParams] = useState(null); // Updated to handle the full data object
  const [noRecordsFound, setNoRecordsFound] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Separate input state
  const [assetIds, setAssetIds] = useState([]);
  const inputRef = useRef(null); // Add a ref for the input field

  // Fetch available Asset IDs
  const fetchAssetIds = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/AssetIds');
      if (!response.ok) {
        throw new Error(`Failed to fetch device details: ${response.statusText}`);
      }
      const data = await response.json();
      setAssetIds(data); // Assuming data is an array of asset IDs
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  useEffect(() => {
    fetchAssetIds();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]); // Re-focus whenever inputValue changes

  // Fetch data based on the selected asset ID
  const handleChange = async (event, assetId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/SummarySearch/${assetId}`); // Update the URL
      const data = response.data;

      if (data && data.length > 0) {
        setSearchParams(data[0]); // Update searchParams with the first record
        setNoRecordsFound(false); // No error message if data is found
      } else {
        setSearchParams(null); // Clear searchParams if no result found
        setNoRecordsFound(true); // Show "No records found" message
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
      setSearchParams(null); // Clear searchParams on error
      setNoRecordsFound(true); // Show "No records found" in case of error
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2} sx={{ width: 250 }}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={assetIds.map((option) => option.AssetID)} // Mapping fetched asset IDs
          inputValue={inputValue} // Separate controlled input value
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Set the typed input value
          onChange={handleChange} // Handle selection
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Asset Id"
              variant="standard"
              inputRef={inputRef}
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: 'search',
                },
              }}
            />
          )}
        />
      </Stack>

      {searchParams ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px', marginTop: '30px' }}>
          <Card variant="outlined" sx={{ width: '20%' }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  Device
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignContent: { xs: 'center', sm: 'flex-start' },
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h5" component="p">
                      {searchParams.Device} 
                    </Typography>
                    {/* <Chip size="small" color="warning" label={`! warning`} /> */}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ width: '30%' }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  Device Condition
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignContent: { xs: 'center', sm: 'flex-start' },
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h5" component="p">
                      {searchParams.ConditionStatus} 
                    </Typography>
                    {/* <Chip size="small" color="warning" label={`! warning`} /> */}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ width: '30%' }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  Current Status
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignContent: { xs: 'center', sm: 'flex-start' },
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h5" component="p">
                      {searchParams.CurrentStatus} 
                    </Typography>
                    {/* <Chip size="small" color="warning" label={`! warning`} /> */}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ width: '30%' }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  Warranty Status
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignContent: { xs: 'center', sm: 'flex-start' },
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h5" component="p">
                      Warranty Expired
                    </Typography>
                    {/* <Chip size="small" color="warning" label={`! warning`} /> */}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* Wrap the two adjacent <Card> elements in a fragment */}
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
            <Card variant="outlined" style={{ marginTop: '10px', marginBottom: '10px' }} sx={{ width: '50%' }}>
              <CardContent>
                <Typography component="h2" variant="h6" gutterBottom>
                  Device Details
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Asset ID: {searchParams.AssetID}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Device: {searchParams.Device}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Device Brand: {searchParams.DeviceBrand}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Model: {searchParams.Model}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Serial Number: {searchParams.SerialNumber}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  SystemType: {searchParams.SystemType}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Processor: {searchParams.Processor}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  InstalledRAM: {searchParams.InstalledRAM}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  ScreenSize: {searchParams.ScreenSize}
                </Typography>
                <Typography component="h2" variant="subtitle1" gutterBottom>
                  Resolution: {searchParams.Resolution}
                </Typography>
                <div className="status-group">
                  <div>
                    <ColorChips label={searchParams.ConditionStatus} />
                  </div>
                  <div>
                    <ColorChips label={searchParams.CurrentStatus} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" style={{ marginTop: '10px', marginBottom: '10px' }} sx={{ width: '50%' }}>
              <CardContent>
                <Typography component="h2" variant="h6" gutterBottom>
                  Billing Details
                </Typography>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        noRecordsFound && <Typography>No records found</Typography>
      )}

      <ToastContainer />
    </div>
  );
};

export default DeviceRecord;
