import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack } from '@mui/material';

export default function TotalDevicesStat() {
  const [deviceChartData, setDeviceChartData] = useState(null);
  const [totalDevicesCount, setTotalDeviceChartData] = useState(0);

  // Fetch Total Devices
  const fetchDeviceData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json(); // Extract the data

      // Check if data is valid (array of objects)
      if (Array.isArray(data)) {
        setDeviceChartData({
          labels: data.map((item) => item.device), // Extract device names for labels
          datasets: [
            {
                label: 'Total Devices',
                data: data.map((item) => item.TotalDeviceCount), // Extract counts for data
            },
            {
                label: 'In Stock',
                data: data.map((item) => item.InstockCount), // Extract counts for data
            },       
            {
                label: 'In Use',
                data: data.map((item) => item.InUseCount), // Extract counts for data
            },    
            {
              label: 'Brand New',
              data: data.map((item) => item.BrandCount), // Extract counts for data
          },    
            {
                label: 'Good Condition',
                data: data.map((item) => item.GoodCount), // Extract counts for data
            },     
            {
                label: 'Issue Identified',
                data: data.map((item) => item.IssueCount), // Extract counts for data
            },      
            {
                label: 'Send to Repair',
                data: data.map((item) => item.RepairCount), // Extract counts for data
            }, 
          ],
        });
      } else {
        throw new Error('Invalid data format received for device data.');
      }
    } catch (error) {
      console.error('Error fetching data for devices by brand:', error);
    }
  };

  const fetchTotalDeviceCount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalDevicesCount');
      const data = await response.json(); 
      console.log('Total Laptops Response:', data);

      if (typeof data.count === 'number') {
        setTotalDeviceChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
    } 
  };



  useEffect(() => {
    fetchDeviceData();
    fetchTotalDeviceCount();
  }, []);

  // Conditional rendering for the chart
  if (!deviceChartData) {
    return <Typography>Loading chart data...</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Devices Statistics
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
              {totalDevicesCount} Units
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total device count upto date
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          xAxis={[{ scaleType: 'band', data: deviceChartData.labels }]}
          series={[
            { data: deviceChartData.datasets[0].data, label: 'Total Devices', stack: 'A' },
            { data: deviceChartData.datasets[1].data, label: 'In Use', stack: 'B' },
            { data: deviceChartData.datasets[2].data, label: 'In Stock', stack: 'B' },
            { data: deviceChartData.datasets[3].data, label: 'Brand New', stack: 'C' },
            { data: deviceChartData.datasets[4].data, label: 'Good Condition', stack: 'C' },
            { data: deviceChartData.datasets[5].data, label: 'Issue Identified', stack: 'C' },
            { data: deviceChartData.datasets[6].data, label: 'Send to Repair', stack: 'C' },

           ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 25 }}
          grid={{ horizontal: true }}
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
