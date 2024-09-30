import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Landing.css";
import logo from './images/Altria-logo.png';
import landing from "./images/landing.png"; 

const Landing = () => {
  const navigate = useNavigate(); 

  const handleLogoClick = () => {
    navigate('/DashboardPage'); 
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img 
          src={logo} 
          alt="Altria Logo" 
          className="landing-logo" 
          onClick={handleLogoClick} 
        />

        <a href="/LoginPage" className="login-btn">
          Login
        </a>
      </header>

      <main className="landing-main">
        <div className="landing-illustration">
          <img src={landing} alt="landing-image" className="header-logo" />
        </div>
      </main>
    </div>
  );
};

export default Landing;
