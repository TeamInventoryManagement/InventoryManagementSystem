import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ColorChips = ({ label }) => {
  let chipColor = 'default';

  if (label === 'In-Use') {
    chipColor = 'success';
  } else if (label === 'In-Stock') {
    chipColor = 'primary';
  }

  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Chip label={label} color={chipColor} />
    </Stack>
  );
};

export default ColorChips;