import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import RepairFormPage from './pages/RepairFormPage';
import LaptopDetailsPage from './pages/LaptopDetailsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<RepairFormPage />} />  {/* Default route */}
        <Route path="LoginPage" element={<LoginPage />} />
        <Route path="RepairFormPage" element={<RepairFormPage />} />
        <Route path="LaptopDetailsPage" element={<LaptopDetailsPage />} />
        <Route path="EmployeeDetailsPage" element={<EmployeeDetailsPage />} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);
