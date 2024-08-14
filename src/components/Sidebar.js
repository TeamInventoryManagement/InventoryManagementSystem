import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import logo from './images/Altria-logo.png';

const Sidebar = () => {
    const [activeSection, setActiveSection] = useState('Inventory');
    const [activeItem, setActiveItem] = useState('Laptop');
    const [isDevicesOpen, setDevicesOpen] = useState(true);

    const toggleDevices = () => {
        setDevicesOpen(!isDevicesOpen);
    };

    return (
        <div className="sidebar">
            <div className="logo">
            <img src={logo} alt="University Logo" className="header-logo" />
            </div>
            <Link to="/" className="menu-item" onClick={() => setActiveSection('Home')}>
                <i className="fas fa-home"></i>
                <span>Home</span>
            </Link>
            <Link 
                to="/inventory" 
                className={`menu-item ${activeSection === 'Inventory' ? 'active' : ''}`}
                onClick={() => setActiveSection('Inventory')}
            >
                <i className="fas fa-tasks"></i>
                <span>Inventory</span>
            </Link>
            <Link to="/transfer-handover" className="menu-item" onClick={() => setActiveSection('TransferHandover')}>
                <i className="fas fa-exchange-alt"></i>
                <span>Transfer / Handover</span>
            </Link>
            <Link to="/RepairFormPage" className="menu-item" onClick={() => setActiveSection('IssueTracker')}>
                <i className="fas fa-clipboard-list"></i>
                <span>Issue Tracker</span>
            </Link>


            <div className="section-title">Devices</div>
            <Link to="/LaptopDetailsPage" className="menu-item" onClick={() => setActiveSection('Laptop')}>
                <i className="fas fa-laptop"></i>
                <span>Laptop</span>
            </Link>
            <Link to="/label" className="menu-item" onClick={() => setActiveSection('Label')}>
                <i className="fas fa-tag"></i>
                <span>Label</span>
            </Link>
            <Link to="/accessories" className="menu-item" onClick={() => setActiveSection('Accessories')}>
                <i className="fas fa-headphones"></i>
                <span>Accessories</span>
            </Link>


            <div className="section-title">Users</div>
            <Link to="/employees" className="menu-item" onClick={() => setActiveSection('Employees')}>
                <i className="fas fa-user"></i>
                <span>Employees</span>
            </Link>
            <Link to="/users-roles" className="menu-item" onClick={() => setActiveSection('UsersRoles')}>
                <i className="fas fa-users-cog"></i>
                <span>Users & Roles</span>
            </Link>

            <div className="section-title">Reports</div>
            <Link to="/in-use-devices" className="menu-item" onClick={() => setActiveSection('InUseDevices')}>
                <i className="fas fa-clipboard-check"></i>
                <span>In Use Devices</span>
            </Link>
            <Link to="/in-stock-devices" className="menu-item" onClick={() => setActiveSection('InStockDevices')}>
                <i className="fas fa-clipboard-list"></i>
                <span>In Stock Devices</span>
            </Link>
        </div>
    );
};

export default Sidebar;
