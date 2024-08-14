import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './images/Altria-logo.png'; 


function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <a href="/LandingPage" ><img src={logo} alt="Altria Logo" className="navbar-logo" /></a>
        
      </div>
      <ul className="navbar-links">
        <li><a href="/LandingPage">HOME</a></li>
        <li><a href="/registerPage">SIGN UP</a></li>
        <li><a href="/loginPage" className="login-button">LOGIN</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;