import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, Typography, Stack } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import HubIcon from '@mui/icons-material/Hub';
import RouterIcon from '@mui/icons-material/Router';
import MouseIcon from '@mui/icons-material/Mouse';

const InvoiceCard = ({ icon: Icon, title, count, color }) => {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500; // Animation duration (0.5 second)
    const increment = count / (duration / 16); // Calculate increment per frame (~60fps)

    const animate = () => {
      if (start < count) {
        start = Math.min(start + increment, count); // Ensure it doesn't exceed target count
        setAnimatedCount(Math.floor(start)); // Update state
        requestAnimationFrame(animate); // Call the next frame
      }
    };

    animate(); // Start the animation

    return () => cancelAnimationFrame(animate); // Cleanup in case of unmount
  }, [count]);

  return (
    <Card sx={{ backgroundColor: color, display: 'flex', alignItems: 'center', p: 2,  width: '20%',marginBottom:4 }}>
      <Box sx={{ mr: 2 }}>
        <Icon style={{ fontSize: 40, color: '#fff' }} />
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: '#fff' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
          {animatedCount} {/* Display the animated count */}
        </Typography>
      </Box>
    </Card>
  );
};

const InvoiceDashboard = () => {
  const [totalDevicesCount, setTotalDeviceChartData] = useState(0);
  const [totalLaptopChartData, setTotalLaptopChartData] = useState(0); // Default to 0 to prevent undefined issues
  const [totalNetworkEquipmentsChartData, setTotalNetworkEquipmentsChartData] = useState(0);
  const [totalAccesoriesChartData, setTotalAccesoriesChartData] = useState(0);

  // Fetch total devices count from server when component mounts
  useEffect(() => {
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

    const fetchLaptopDeviceCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalLaptopCount');
        const data = await response.json(); // Correctly parse the JSON response
        console.log('Total Laptops Response:', data); // Debug log to inspect the response
        
        if (typeof data.count === 'number') {
          setTotalLaptopChartData(data.count);
        } else {
          throw new Error('Invalid data format received for total laptop count.');
        }
      } catch (error) {
        console.error('Error fetching total laptop count:', error);
      }
    };

    // Fetch Total NetworkEquipments
    const fetchNetworkEquipmentsCount= async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalNetworkEquipments');
        const data = await response.json(); // Correctly parse the JSON response
        console.log('Total Laptops Response:', data); // Debug log to inspect the response
   
        if (typeof data.count === 'number') {
          setTotalNetworkEquipmentsChartData(data.count);
        } else {
          throw new Error('Invalid data format received for total device count.');
        }
      } catch (error) {
        console.error('Error fetching total device count:', error);
      } 
    };



  // Fetch Total Accesories
  const fetchAccesoriesCount= async () => {
    try {
      const response = await fetch('http://localhost:3000/api/totalAccesoriesCount');
      const data = await response.json(); // Correctly parse the JSON response
      console.log('Total Laptops Response:', data); // Debug log to inspect the response
 
      if (typeof data.count === 'number') {
        setTotalAccesoriesChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
    } 
  };    

    fetchTotalDeviceCount();
    fetchLaptopDeviceCount();
    fetchNetworkEquipmentsCount();
    fetchAccesoriesCount();

  }, []);

  return (
    // <Box sx={{ flexGrow: 1, p: 3 }}>
    //   <Grid container spacing={3}>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <InvoiceCard
    //         icon={LaptopMacIcon}
    //         title="Total Devices"
    //         count={totalDevicesCount} // Use the fetched count here
    //         color="#4B6EFD"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <InvoiceCard
    //         icon={LocalShippingIcon}
    //         title="Total Laptops"
    //         count={totalLaptopChartData} // Use the fetched count here
    //         color="#1CB0F6"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <InvoiceCard
    //         icon={CheckCircleIcon}
    //         title="Total Network Equipments"
    //         count={totalNetworkEquipmentsChartData}
    //         color="#00D69B"
    //       />
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={3}>
    //       <InvoiceCard
    //         icon={HourglassEmptyIcon}
    //         title="Total Accessories"
    //         count={totalAccesoriesChartData}
    //         color="#FFB648"
    //       />
    //     </Grid>
    //   </Grid>
    // </Box>
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <InvoiceCard
            icon={DevicesOtherIcon}
            title="Total Devices"
            count={totalDevicesCount} // Use the fetched count here
            color="#4B6EFD"
          />
            <InvoiceCard
             icon={LaptopMacIcon}
             title="Total Laptops"
             count={totalLaptopChartData} // Use the fetched count here
             color="#1CB0F6"
           />
           <InvoiceCard
             icon={RouterIcon}
             title="Total Network Equipments"
             count={totalNetworkEquipmentsChartData}
             color="#00D69B"
           />
           <InvoiceCard
             icon={MouseIcon}
             title="Total Accessories"
             count={totalAccesoriesChartData}
             color="#FFB648"
           />
    </Stack>
  );
};

export default InvoiceDashboard;
