import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import RepairFormPage from './pages/RepairFormPage';
// import LoginPage from './pages/LoginPage';
import LaptopDetailsPage from './pages/LaptopDetailsPage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<LaptopDetailsPage />} />  {/* Default route */}
        <Route path="RepairFormPage" element={<RepairFormPage />} />
        {/* <Route path="loginPage" element={<LoginPage />} /> */}
        <Route path="LaptopDetailsPage" element={<LaptopDetailsPage />} />
      </Route>
    </Routes>
  </Router>,
  document.getElementById('root')
);
