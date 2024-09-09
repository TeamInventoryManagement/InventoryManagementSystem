import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack } from '@mui/material';

export default function LaptopConditionStats() {
  const [laptopChartData, setLaptopChartData] = useState(null);

  // Fetch Total Devices
  const fetchLaptopConditionData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json();

      const laptopData = data.find((item) => item.device === 'Laptop');

      if (laptopData && laptopData.InstockCount !== undefined && laptopData.InUseCount !== undefined) {
        setLaptopChartData({
          data: [
            { label: 'Good Condition', value: laptopData.GoodCount },
            { label: 'Issue Identified', value: laptopData.IssueCount },
            { label: 'Send to Repair', value: laptopData.RepairCount },
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
    fetchLaptopConditionData();
  }, []);

  // Conditional rendering for the chart
  if (!laptopChartData) {
    return <Typography>Loading chart data...</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ width: '50%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Laptop Condition Statistics
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
            Laptops Conditions: {laptopChartData.data.map(d => `${d.label}: ${d.value}`).join(', ')}
          </Typography>
        </Stack>
        <PieChart
          series={[
            {
              data: laptopChartData.data,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 60, additionalRadius: -30, color: 'gray', outerRadius: 100, cornerRadius: 10 },
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
