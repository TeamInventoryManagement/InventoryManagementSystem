import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack } from '@mui/material';
import Chip from '@mui/material/Chip';

export default function LaptopWarrStats() {
  const [laptopWarrData, setLaptopWarrData] = useState(null);
  const [laptopTotal, setLaptopTotal] = useState(null);
  const [laptopWarExpTotal, setLaptopWarExpTotal] = useState(null);

  // Fetch Laptop Warranty Data
  const fetchLaptopWarrData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/WarrExp');
      const data = await response.json();

      if (Array.isArray(data)) {
        setLaptopWarrData({
          labels: data.map((item) => item.WarExpYear.toString()), // Convert years to strings
          warExpCount: data.map((item) => item.WarExpCount), // WarExpCount data
          cumExpCount: data.map((item) => item.CumExpCount), // CumExpCount data
        });
      } else {
        throw new Error('Invalid laptop data or data not found.');
      }
    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  const fetchLaptopTotal = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalLaptopCount');
      const data = await response.json();

      setLaptopTotal(data.count);  // Directly setting laptopTotal
      console.log(data.count);
    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  const fetchLaptopWarExpTotal = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalLaptopExpCount');
      const data = await response.json();

      setLaptopWarExpTotal(data.countWarExp);  // Directly setting laptopTotal
      console.log(data.countWarExp);
    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopWarrData();
    fetchLaptopTotal();
    fetchLaptopWarExpTotal();
  }, []);

  // Conditional rendering for the chart
  if (!laptopWarrData) {
    return <Typography>Loading chart data...</Typography>;
  }

  const years = laptopWarrData.labels; // Extract the years as strings

  // Calculate the laptop expired percentage
  const LaptopExpPercentage = laptopWarExpTotal && laptopTotal ? 
    ((laptopWarExpTotal / laptopTotal) * 100).toFixed(2) : 0; // Percentage rounded to two decimal places

  return (
    <Card variant="outlined" sx={{ width: '100%'}}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Laptop Warranty Expiration Statistics
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
              {laptopWarExpTotal} Units
            </Typography>
            <Chip 
              size="small" 
              color="error" 
              label={`${LaptopExpPercentage}% Expired`}  // Display percentage with label
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Expired Laptop Count upto date
          </Typography>
        </Stack>
        <LineChart
          xAxis={[
            {
              data: laptopWarrData.labels, // Use year strings for X-axis
              label: 'Year', // Label for X-axis
              scaleType: 'point', // Use 'band' scale for discrete categorical values
              valueFormatter: (value) => value.toString(), // Format X-axis labels as strings (years)
            },
          ]}
          series={[
            {
              data: laptopWarrData.cumExpCount, // CumExpCount (Cumulative)
              label: 'Cumulative Expiration Count',
              area: true,
              min: 0,
            },
            {
              data: laptopWarrData.warExpCount, // WarExpCount (Yearly)
              label: 'Warranty Expiration within Year',
              area: true,
              min: 0,
            },
          ]}
          height={350}
          slotProps={{
            legend: {
              hidden: false, // Display legend to differentiate the two datasets
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
            },
          }}
          margin={{ left: 30, right: 30, top: 30, bottom: 80 }}
          grid={{ vertical: true, horizontal: true }}
    
        />
      </CardContent>
    </Card>
  );
}
