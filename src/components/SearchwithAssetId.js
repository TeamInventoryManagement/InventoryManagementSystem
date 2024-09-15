import React, { useEffect, useState } from "react";
import { Autocomplete, Stack, TextField } from "@mui/material";

const SearchwithAssetId = ({ handleSelectAssetId }) => {
  const [assetIds, setAssetIds] = useState([]);
  const [value, setValue] = useState(null);  // For storing the selected value
  const [inputValue, setInputValue] = useState('');  // For controlling the input value

  const fetchAssetIds = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/AssetIds`);
      if (!response.ok) {
        throw new Error(`Failed to fetch asset IDs: ${response.statusText}`);
      }
      const data = await response.json();
      setAssetIds(data); // Assuming data is an array of asset IDs
    } catch (error) {
      console.error('Error fetching asset IDs:', error);
    }
  };

  useEffect(() => {
    fetchAssetIds();
  }, []);

  return (
    <div>
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          freeSolo
          id="free-solo-asset-id"
          disableClearable
          options={assetIds.map((option) => option.AssetID)} // Mapping fetched asset IDs
          value={value} // Controlled value for the selected item
          inputValue={inputValue} // Controlled value for the typed input
          onChange={(event, newValue) => {
            setValue(newValue);  // Set the selected AssetID
            handleSelectAssetId(newValue);  // Pass selected AssetID to the parent
          }}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Control the input value
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Asset Id"
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
    </div>
  );
};

export default SearchwithAssetId;
