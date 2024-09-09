import React from 'react';
import InvoiceDashboard from './Cards'; // Adjust the path if needed
import TotalDevicesStat from './MUICharts';
import LaptopStats from './LaptopCharts';
import LaptopConditionStats from './LaptopConditionCharts';
import LaptopAgeStats from './LaptopAge';
import LaptopWarrStats from './LaptopWarrantyLine';

const Dashboard = () => {
  return (
    <div>
      <InvoiceDashboard />

      <div style={{ marginBottom: '20px' }}>
        <TotalDevicesStat />
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