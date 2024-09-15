import * as React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack, Chip } from '@mui/material';

export default function LaptopInUseIssueDataCard() {
  const [laptopInUseIssueCount, setLaptopInUseIssueCount] = useState(0); // default value set to 0

  // Fetch Total Devices
  const fetchLaptopInUseIssueDataCard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json();

      const laptopData = data.find((item) => item.device === 'Laptop');

      const laptopInUseIssueCount = laptopData.InUseFairCount || 0; // Set default to 0 in case of missing data

      setLaptopInUseIssueCount(laptopInUseIssueCount);


    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopInUseIssueDataCard();
  }, []);


  return (
    <Card variant="outlined" sx={{ width: '30%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          In Use Laptops with Issues
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
            <Typography variant="h4" component="p">
              {laptopInUseIssueCount} Units
            </Typography>
            <Chip
              size="small"
              color="warning"
              label={`! warning`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            In Use - Issue Identified Laptops
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
