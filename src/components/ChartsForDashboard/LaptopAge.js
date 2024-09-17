import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack } from '@mui/material';

export default function LaptopAgeStats() {
  const [laptopAgeData, setLaptopAgeData] = useState(null);

  // Fetch Laptop Age Data
  const fetchLaptopAgeData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/LaptopAge');
      const data = await response.json();

      if (Array.isArray(data)) {
        setLaptopAgeData({
          labels: data.map((item) => item.LaptopAgeToToday), // Keep labels as string categories
          data: data.map((item) => item.Count), // Extract data (counts)
        });
      } else {
        throw new Error('Invalid laptop data or data not found.');
      }
    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopAgeData();
  }, []);

  // Conditional rendering for the chart
  if (!laptopAgeData) {
    return <Typography>Loading chart data...</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Laptop Lifetime Statistics
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
            {/* <Typography variant="h4" component="p">
              Units
            </Typography> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Laptops Age upto date
          </Typography>
        </Stack>
        <LineChart
          xAxis={[
            {
              data: laptopAgeData.labels, // Use categorical data for X-axis
              label: 'Laptop Age', // Label for X-axis
              scaleType: 'point', // Treat the X-axis as a categorical scale0
              min: 0, 
            },
          ]}
          series={[
            {
              data: laptopAgeData.data, // Y-axis data
              label: 'Count', // Label for the dataset
              area: true,
              min: 0, 
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          grid={{ vertical: true, horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}
