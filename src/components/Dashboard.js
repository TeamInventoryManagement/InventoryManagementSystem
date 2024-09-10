import React from 'react';
import InvoiceDashboard from './Cards'; // Adjust the path if needed
import TotalDevicesStat from './ChartsForDashboard/MUICharts';
import LaptopStats from './ChartsForDashboard/LaptopCharts';
import LaptopConditionStats from './ChartsForDashboard/LaptopConditionCharts';
import LaptopAgeStats from './ChartsForDashboard/LaptopAge';
import LaptopWarrStats from './ChartsForDashboard/LaptopWarrantyLine';
import LaptopInStockGoodDataCard from './CardsForDashboard/LaptopInStockGoodCondition';

const Dashboard = () => {
  return (
    <div>
      <InvoiceDashboard />

      <div style={{ marginBottom: '20px' }}>
        <TotalDevicesStat />
      </div>
      <div style={{ marginBottom: '20px' }}>
      <LaptopInStockGoodDataCard />
      </div>

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