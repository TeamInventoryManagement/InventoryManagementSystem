import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; 
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RepairFormPage from './pages/RepairFormPage';
import LaptopDetailsPage from './pages/LaptopDetailsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import TransferPage from './pages/TransferPage';
import HandoverPage from './pages/HandoverPage';
import NetworkEquipmentPage from './pages/NetworkEquipmentPage';
import AccessoriesPage from './pages/AccessoriesPage';
import InUseDevicePage from './pages/InUseDevicePage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TransferDevicesPage from './pages/TransferDevicesPage';
import InventoryPage from './pages/InventoryPage';
import EmployeeChartPage from './pages/EmployeeChartPage';
import DashboardPage from './pages/DashboardPage';
import IssueTrackerPage2 from './pages/IssueTrackerPage2';
import SearchDevicePage from './pages/SearchDevicePage';
import DeviceRecordPage from './pages/DeviceRecordPage';


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<LandingPage />} />  {/* Default route */}
        <Route path="LandingPage" element={<LandingPage />} />
        <Route path="LoginPage" element={<LoginPage />} />
        <Route path="RepairFormPage" element={<RepairFormPage />} />
        <Route path="LaptopDetailsPage" element={<LaptopDetailsPage />} />
        <Route path="EmployeeDetailsPage" element={<EmployeeDetailsPage />} />
        <Route path="TransferPage" element={<TransferPage />} />
        <Route path="HandoverPage" element={<HandoverPage />} />
        <Route path="NetworkEquipmentPage" element={<NetworkEquipmentPage />} />
        <Route path="AccessoriesPage" element={<AccessoriesPage />} />
        <Route path="InUseDevicePage" element={<InUseDevicePage />} />
        <Route path="RegisterPage" element={<RegisterPage />} />
        <Route path="HomePage" element={<HomePage />} />
        <Route path="TransferDevicesPage" element={<TransferDevicesPage />} />
        <Route path="InventoryPage" element={<InventoryPage />} />
        <Route path="EmployeeChartPage" element={<EmployeeChartPage />} />
        <Route path="DashboardPage" element={<DashboardPage />} />
        <Route path="IssueTrackerPage2" element={<IssueTrackerPage2 />} />
        <Route path="SearchDevicePage" element={<SearchDevicePage />} />
        <Route path="DeviceRecordPage" element={<DeviceRecordPage />} />
        {/* <Route path="AccessoriesPage" element={<AccessoriesPage />} /> */}
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);
