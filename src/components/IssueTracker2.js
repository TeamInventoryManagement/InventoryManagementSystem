import React from "react";
import "./RepairForm.css";
import { Autocomplete, Stack, TextField } from "@mui/material";
 
const RepairForm = () => {

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003
    }]

  return (
    <div>
    <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={top100Films.map((option) => option.title)}
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
 
export default RepairForm;
