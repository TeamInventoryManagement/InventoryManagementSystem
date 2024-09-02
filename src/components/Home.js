import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
 
// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);
 
const Home = () => {
 
    // TotalDevices Count
  const [totalDeviceChartData, setTotalDeviceChartData] = useState(null);
  const [totalDeviceLoading, setTotalDeviceLoading] = useState(true);
  const [totalDeviceError, setTotalDeviceError] = useState(null);
   
  // TotalAccesories Count
  const [totalAccesoriesChartData, setTotalAccesoriesChartData] = useState(null);
  const [totalAccesoriesLoading, setTotalAccesoriesLoading] = useState(true);
  const [totalAccesoriesError, setTotalAccesoriesError] = useState(null);
 
  // TotalLaptop Count
  const [totalLaptopChartData, setTotalLaptopChartData] = useState(null);
  const [totalLaptopLoading, setTotalLaptopLoading] = useState(true);
  const [totalLaptopError, setTotalLaptopError] = useState(null);
 
  // TotalNetworkEquipments Count
  const [totalNetworkEquipmentsChartData, setTotalNetworkEquipmentsChartData] = useState(null);
  const [totalNetworkEquipmentsLoading, setTotalNetworkEquipmentsLoading] = useState(true);
  const [totalNetworkEquipmentsError, setTotalNetworkEquipmentsError] = useState(null);
 
 
  // State for Total Devices by Brand
  const [brandChartData, setBrandChartData] = useState(null);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState(null);
 
  // State for Devices by Status
  const [statusChartData, setStatusChartData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState(null);
 
 
  // Laptop Condition Status
  const [conditionChartData, setConditionChartData] = useState(null);
  const [conditionLoading, setConditionLoading] = useState(true);
  const [conditionError, setConditionError] = useState(null);
 
  // Devices Count not in laptops
  const [deviceChartData, setDeviceChartData] = useState(null);
  const [deviceLoading, setDeviceLoading] = useState(true);
  const [deviceError, setDeviceError] = useState(null);
 
 
// Fetch device Total
const fetchTotalDeviceCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/totalDevicesCount');
      const data = response.data;
 
      if (typeof data.count === 'number') {
        setTotalDeviceChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
      setTotalDeviceError(error.message || 'An unexpected error occurred while fetching total device count.');
    } finally {
      setTotalDeviceLoading(false);
    }
  };
 
  // Fetch laptop Devices
  const fetchLaptopDeviceCount= async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/totalLaptopCount');
      const data = response.data;
 
      if (typeof data.count === 'number') {
        setTotalLaptopChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
      setTotalLaptopError(error.message || 'An unexpected error occurred while fetching total device count.');
    } finally {
      setTotalLaptopLoading(false);
    }
  };
 
 
  // Fetch Total Accesories
  const fetchAccesoriesCount= async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/totalAccesoriesCount');
      const data = response.data;
 
      if (typeof data.count === 'number') {
        setTotalAccesoriesChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
      setTotalAccesoriesError(error.message || 'An unexpected error occurred while fetching total device count.');
    } finally {
        setTotalAccesoriesLoading(false);
    }
  };
 
   // Fetch Total NetworkEquipments
   const fetchNetworkEquipmentsCount= async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/totalNetworkEquipments');
      const data = response.data;
 
      if (typeof data.count === 'number') {
        setTotalNetworkEquipmentsChartData(data.count);
      } else {
        throw new Error('Invalid data format received for total device count.');
      }
    } catch (error) {
      console.error('Error fetching total device count:', error);
      setTotalNetworkEquipmentsError(error.message || 'An unexpected error occurred while fetching total device count.');
    } finally {
        setTotalNetworkEquipmentsLoading(false);
    }
  };
 
 
   // Fetch Total Devices by Brand
  const fetchBrandData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/totalDevicesByBrand');
      const data = response.data;
 
      // Verify data structure
      if (Array.isArray(data)) {
        setBrandChartData({
          labels: data.map((item) => item.DeviceBrand),
          datasets: [
            {
              label: 'Total Devices by Brand',
              data: data.map((item) => item.TotalDevices),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } else {
        throw new Error('Invalid data format received for brand data.');
      }
    } catch (error) {
      console.error('Error fetching data for devices by brand:', error);
      setBrandError(error.message || 'An unexpected error occurred while fetching brand data.');
    } finally {
      setBrandLoading(false);
    }
  };
 
  // Fetch Devices by Status
  const fetchStatusData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/countByStatus');
      const data = response.data;
 
      // Verify data structure
      if (Array.isArray(data)) {
        setStatusChartData({
          labels: data.map((item) => item.CurrentStatus),
          datasets: [
            {
              label: 'Devices by Status',
              data: data.map((item) => item.count),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      } else {
        throw new Error('Invalid data format received for status data.');
      }
    } catch (error) {
      console.error('Error fetching data for devices by status:', error);
      setStatusError(error.message || 'An unexpected error occurred while fetching status data.');
    } finally {
      setStatusLoading(false);
    }
  };
 
   // Fetch Devices by Status
   const fetchConditionData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/conditionStatus');
      const data = response.data;
 
      // Verify data structure
      if (Array.isArray(data)) {
        setConditionChartData({
          labels: data.map((item) => item.ConditionStatus),
          datasets: [
            {
              label: 'Devices by Status',
              data: data.map((item) => item.TotalCondition),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      } else {
        throw new Error('Invalid data format received for status data.');
      }
    } catch (error) {
      console.error('Error fetching data for devices by status:', error);
      setConditionError(error.message || 'An unexpected error occurred while fetching status data.');
    } finally {
      setConditionLoading(false);
    }
  };
 
   
  // Fetch Total Devices
  const fetchDeviceData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/devicesCount');
      const data = response.data;
 
      // Verify data structure
      if (Array.isArray(data)) {
        setDeviceChartData({
          labels: data.map((item) => item.device),
          datasets: [
            {
              label: 'Total Devices',
              data: data.map((item) => item.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } else {
        throw new Error('Invalid data format received for brand data.');
      }
    } catch (error) {
      console.error('Error fetching data for devices by brand:', error);
      setDeviceError(error.message || 'An unexpected error occurred while fetching brand data.');
    } finally {
      setDeviceLoading(false);
    }
  };
 
 
  useEffect(() => {
    fetchTotalDeviceCount();
    fetchLaptopDeviceCount();
    fetchAccesoriesCount();
    fetchNetworkEquipmentsCount();
    fetchBrandData();
    fetchStatusData();
    fetchConditionData();
    fetchDeviceData();
 
  }, []);
 
  return (
 
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
  <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
    <span style={{ color: 'navy',fontSize:'50px' }}>Altria Inventory Management</span>{' '}
    <span style={{ color: 'orange',fontSize:'50px' }}>Dashboard</span>
  </h1>
 
 
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap', marginBottom: '40px' }}>
  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 22%', margin: '5px', minWidth: '200px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px' ,fontSize:'20px'}}>Total Devices</h2>
    {totalDeviceLoading && <p style={{ textAlign: 'center' }}>Loading total count...</p>}
    {totalDeviceError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {totalDeviceError}</p>}
    {!totalDeviceLoading && !totalDeviceError && totalDeviceChartData !== null && (
      <p style={{ textAlign: 'center', fontSize: '2.0em', fontWeight: 'bold' }}>{totalDeviceChartData}</p>
    )}
  </div>
 
  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 22%', margin: '5px', minWidth: '200px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px',fontSize:'20px' }}>Total Laptops</h2>
    {totalLaptopLoading && <p style={{ textAlign: 'center' }}>Loading total count...</p>}
    {totalLaptopError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {totalLaptopError}</p>}
    {!totalLaptopLoading && !totalLaptopError && totalLaptopChartData !== null && (
      <p style={{ textAlign: 'center', fontSize: '2.0em', fontWeight: 'bold' }}>{totalLaptopChartData}</p>
    )}
  </div>
 
  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 22%', margin: '5px', minWidth: '200px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px',fontSize:'20px' }}>Total Accessories</h2>
    {totalAccesoriesLoading && <p style={{ textAlign: 'center' }}>Loading total count...</p>}
    {totalAccesoriesError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {totalAccesoriesError}</p>}
    {!totalAccesoriesLoading && !totalAccesoriesError && totalAccesoriesChartData !== null && (
      <p style={{ textAlign: 'center', fontSize: '2.0em', fontWeight: 'bold' }}>{totalAccesoriesChartData}</p>
    )}
  </div>
 
  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flex: '0 0 22%', margin: '5px', minWidth: '200px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px',fontSize:'20px' }}>Total Network Equipments</h2>
    {totalNetworkEquipmentsLoading && <p style={{ textAlign: 'center' }}>Loading total count...</p>}
    {totalNetworkEquipmentsError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {totalNetworkEquipmentsError}</p>}
    {!totalNetworkEquipmentsLoading && !totalNetworkEquipmentsError && totalNetworkEquipmentsChartData !== null && (
      <p style={{ textAlign: 'center', fontSize: '2.0em', fontWeight: 'bold' }}>{totalNetworkEquipmentsChartData}</p>
    )}
  </div>
</div>
 
     
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', margin: '0 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px',fontSize:'20px' }}>Total Laptops by Brand</h2>
          {brandLoading && <p style={{ textAlign: 'center' }}>Loading brand data...</p>}
          {brandError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {brandError}</p>}
          {!brandLoading && !brandError && brandChartData && (
            <Bar
              data={brandChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Device Brand',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Total Devices',
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', margin: '0 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px',fontSize:'20px' }}>Laptops Availability</h2>
          {statusLoading && <p style={{ textAlign: 'center' }}>Loading status data...</p>}
          {statusError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {statusError}</p>}
          {!statusLoading && !statusError && statusChartData && (
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', margin: '0 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' ,fontSize:'20px'}}>Devices Counts</h2>
          {deviceLoading && <p style={{ textAlign: 'center' }}>Loading device data...</p>}
          {deviceError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {deviceError}</p>}
          {!deviceLoading && !deviceError && deviceChartData && (
            <Bar
              data={deviceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Device',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Total',
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
 
 
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', margin: '0 20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px',fontSize:'20px' }}>Laptops Condition</h2>
          {conditionLoading && <p style={{ textAlign: 'center' }}>Loading status data...</p>}
          {conditionError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {conditionError}</p>}
          {!conditionLoading && !conditionError && conditionChartData && (
            <Doughnut
              data={conditionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
 
    </div>
  );
};
 
export default Home;