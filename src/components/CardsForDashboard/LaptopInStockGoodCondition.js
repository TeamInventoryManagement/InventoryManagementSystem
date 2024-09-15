import * as React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Stack, Chip } from '@mui/material';

export default function LaptopInStockGoodDataCard() {
  const [laptopInstockGoodCount, setLaptopInstockGoodCount] = useState(0); // default value set to 0
  const [laptopInstockBrandCount, setLaptopInstockBrandCount] = useState(0);

  // Fetch Total Devices
  const fetchLaptopInStockGoodDataCard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Inventory');
      const data = await response.json();

      const laptopData = data.find((item) => item.device === 'Laptop');

      const laptopInstockGoodCount = laptopData.InstockGoodCount || 0; // Set default to 0 in case of missing data
      const laptopInstockBrandCount = laptopData.BrandCount || 0;

      setLaptopInstockGoodCount(laptopInstockGoodCount);
      setLaptopInstockBrandCount(laptopInstockBrandCount);

    } catch (error) {
      console.error('Error fetching data for laptops:', error);
    }
  };

  useEffect(() => {
    fetchLaptopInStockGoodDataCard();
  }, []);

  const totalLaptopCount = laptopInstockGoodCount + laptopInstockBrandCount; // Calculate total

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
              {totalLaptopCount} Units
            </Typography>
            <Chip
              size="small"
              color="success"
              label={`Available`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            In Stock - Brand New and Good Condition Laptops
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
