import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';  // Corrected path
import './App.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
