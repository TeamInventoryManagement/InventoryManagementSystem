import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; 
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RepairFormPage from './pages/RepairFormPage';
import LaptopDetailsPage from './pages/LaptopDetailsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import TransferHandoverPage from './pages/TransferHandoverPage';
import NetworkEquipmentPage from './pages/NetworkEquipmentPage';
import AccessoriesPage from './pages/AccessoriesPage';

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
        <Route path="TransferHandoverPage" element={<TransferHandoverPage />} />
        <Route path="NetworkEquipmentPage" element={<NetworkEquipmentPage />} />
        <Route path="AccessoriesPage" element={<AccessoriesPage />} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);
