import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack, Chip } from '@mui/material';

export default function LaptopInStockGoodDataCard() {
    const [laptopInstockGoodCount, setlaptopInstockGoodCount] = useState(null);
  // Fetch Total Devices
  const fetchLaptopInStockGoodDataCard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json();

      const laptopData = data.find((item) => item.device === 'Laptop');

      const laptopInstockGoodCount = laptopData.InstockGoodCount;

      setlaptopInstockGoodCount(laptopInstockGoodCount);

    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopInStockGoodDataCard();
  }, []);


  return (
    <Card variant="outlined" sx={{ width: '30%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Laptop Availability
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
              {laptopInstockGoodCount} Units
            </Typography>
            <Chip 
              size="small" 
              color="success" 
              label='Available'  // Display percentage with label
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            In Stock Good Condition Laptops
          </Typography>
        </Stack>

      </CardContent>
    </Card>
  );
}
