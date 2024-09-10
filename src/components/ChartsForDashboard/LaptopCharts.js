import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack } from '@mui/material';

export default function LaptopStats() {
  const [laptopChartData, setLaptopChartData] = useState(null);

  // Fetch Total Devices
  const fetchLaptopData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json();

      const laptopData = data.find((item) => item.device === 'Laptop');

      if (laptopData && laptopData.InstockCount !== undefined && laptopData.InUseCount !== undefined) {
        setLaptopChartData({
          data: [
            { label: 'In Stock', value: laptopData.InstockCount },
            { label: 'In Use', value: laptopData.InUseCount },
          ],
        });
      } else {
        throw new Error('Invalid laptop data or data not found.');
      }
    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopData();
  }, []);

  // Conditional rendering for the chart
  if (!laptopChartData) {
    return <Typography>Loading chart data...</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ width: '50%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Laptop Usage Statistics
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
              {laptopChartData.data.reduce((acc, curr) => acc + curr.value, 0)} Units
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            In Stock and In Use laptops: {laptopChartData.data.map(d => `${d.label}: ${d.value}`).join(', ')}
          </Typography>
        </Stack>
        <PieChart
          series={[
            {
              data: laptopChartData.data,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              valueFormatter: (item) => `${item.value} units`, // Correctly format each item
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />

      </CardContent>
    </Card>
  );
}
