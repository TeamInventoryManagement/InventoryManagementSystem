import React from 'react';
import InvoiceDashboard from './Cards'; // Adjust the path if needed
import TotalDevicesStat from './ChartsForDashboard/MUICharts';
import LaptopStats from './ChartsForDashboard/LaptopCharts';
import LaptopConditionStats from './ChartsForDashboard/LaptopConditionCharts';
import LaptopAgeStats from './ChartsForDashboard/LaptopAge';
import LaptopWarrStats from './ChartsForDashboard/LaptopWarrantyLine';
import LaptopInStockGoodDataCard from './CardsForDashboard/LaptopInStockGoodCondition';
import { Chip, Divider, Stack } from '@mui/material';
import LaptopInUseIssueDataCard from './CardsForDashboard/LaptopInUseIssue';
import LaptopDisposableDataCard from './CardsForDashboard/LaptopDisposable';

const Dashboard = () => {
  return (
    <div>
      <InvoiceDashboard />

      <div style={{ marginBottom: '30px' }}>
        <TotalDevicesStat />
      </div>
      <Divider sx={{marginBottom: '20px'  }}>
        <Chip label="Laptop Statistics" />
      </Divider>
      <Stack direction="row" sx={{ justifyContent: 'space-between',marginBottom: '20px'  }}>
      <LaptopInStockGoodDataCard />
      <LaptopInUseIssueDataCard/>
      <LaptopDisposableDataCard/>
      </Stack>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px',marginBottom: '20px' }}>
        <LaptopStats />
        <LaptopConditionStats />
        
      </div>
      <div style={{ marginBottom: '20px' }}>
        <LaptopAgeStats />
      </div>
      <LaptopWarrStats />

    </div>
  );
};

export default Dashboard;