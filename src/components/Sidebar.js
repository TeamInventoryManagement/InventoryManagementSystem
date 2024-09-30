import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logo from './images/Altria-logo.png';



const Sidebar = () => {
    const [activeSection, setActiveSection] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');  
        sessionStorage.clear();  

        
        navigate('/landingPage');
    };

    return (
        <>
            
            <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            
            <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>

            <div className="logo">
                <Link to="/DashboardPage">
                    <img src={logo} alt="Altria Logo" className="header-logo" />
                </Link>
            </div>

                <Link to="/DashboardPage" className={`menu-item ${activeSection === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('Dashboard')}>
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                </Link>
 
                <Link to="/InventoryPage" className={`menu-item ${activeSection === 'Inventory' ? 'active' : ''}`} onClick={() => setActiveSection('Inventory')}>
                    <i className="fas fa-book"></i>
                    <span>Inventory</span>
                </Link>

                <Link to="/SearchDevicePage" className={`menu-item ${activeSection === 'DeviceSearch' ? 'active' : ''}`} onClick={() => setActiveSection('DeviceSearch')}>
                    <i className="fas fa-search"></i>
                    <span>Device Search</span>
                </Link>

                <Link to="/TransferPage" className={`menu-item ${activeSection === 'Transfer' ? 'active' : ''}`} onClick={() => setActiveSection('Transfer')}>
                    <i className="fas fa-exchange-alt"></i>
                    <span>Transfer</span>
                </Link>
                <Link to="/HandoverPage" className={`menu-item ${activeSection === 'Handover' ? 'active' : ''}`} onClick={() => setActiveSection('Handover')}>
                    <i className="fas fa-handshake"></i>
                    <span>Handover</span>
                </Link>

                <Link to="/IssueTrackerPage2" className={`menu-item ${activeSection === 'IssueTracker2' ? 'active' : ''}`} onClick={() => setActiveSection('IssueTracker2')}>
                    <i className="fas fa-clipboard-list"></i>
                    <span>Issue Tracker</span>
                </Link>
                <div className="section-title">Devices</div>
                <Link to="/LaptopDetailsPage" className={`menu-item ${activeSection === 'Laptop' ? 'active' : ''}`} onClick={() => setActiveSection('Laptop')}>
                    <i className="fas fa-laptop"></i>
                    <span>Laptop</span>
                </Link>
                <Link to="/NetworkEquipmentPage" className={`menu-item ${activeSection === 'NetworkEquipment' ? 'active' : ''}`} onClick={() => setActiveSection('NetworkEquipment')}>
                    <i className="fas fa-tag"></i>
                    <span>Network Equipment</span>
                </Link>
                <Link to="/AccessoriesPage" className={`menu-item ${activeSection === 'Accessories' ? 'active' : ''}`} onClick={() => setActiveSection('Accessories')}>
                    <i className="fas fa-headphones"></i>
                    <span>Accessories</span>
                </Link>

                <div className="section-title">Users</div>
                <Link to="/EmployeeDetailsPage" className={`menu-item ${activeSection === 'Employees' ? 'active' : ''}`} onClick={() => setActiveSection('Employees')}>
                    <i className="fas fa-user"></i>
                    <span>Employees</span>
                </Link>

                <Link to="/users-roles" className={`menu-item ${activeSection === 'UsersRoles' ? 'active' : ''}`} onClick={() => setActiveSection('UsersRoles')}>
                    <i className="fas fa-users-cog"></i>
                    <span>Users & Roles</span>
                </Link>

                <div className="section-title">Reports</div>
                <Link to="/InUseDevicePage" className={`menu-item ${activeSection === 'InUseDevices' ? 'active' : ''}`} onClick={() => setActiveSection('InUseDevices')}>
                    <i className="fas fa-clipboard-check"></i>
                    <span>Device Details</span>
                </Link>
                <Link to="/TransferDevicesPage" className={`menu-item ${activeSection === 'TransferDetails' ? 'active' : ''}`} onClick={() => setActiveSection('TransferDetails')}>
                    <i className="fas fa-clipboard-list"></i>
                    <span>Transfer Details</span>
                </Link>

                <Link to="/EmployeeChartPage" className={`menu-item ${activeSection === 'EmployeeChart' ? 'active' : ''}`} onClick={() => setActiveSection('EmployeeChart')}>
                    <i className="fas fa-clipboard-list"></i>
                    <span>Employee Details</span>
                </Link>


                <div className="menu-item2" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </div>
  


            </div>

            
        </>
    );
};

export default Sidebar;