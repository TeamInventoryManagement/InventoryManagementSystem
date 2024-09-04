import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ColorChips = ({ label }) => {
  let chipColor = 'default';

  if (label === 'Good-Condition' || label === 'In-Use') {
    chipColor = 'success';
  } else if (label === 'In-Stock') {
    chipColor = 'primary';
  } else if (label === 'Issue-Identified') {
    chipColor = 'warning';
  } else if (label === 'Send-to-Repair') {
    chipColor = 'secondary';
  } else if (label === 'Disposal') {
    chipColor = 'error';
  } 

  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Chip label={label} color={chipColor} />
    </Stack>
  );
};

export default ColorChips;