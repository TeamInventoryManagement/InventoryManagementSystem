import React from "react";
import "./Landing.css";
import logo from './images/Altria-logo.png';
import landing from "./images/landing.png"; // Adjust the path to your logo image

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logo} alt="Altria Logo" className="landing-logo" />

        <a href="/LaptopDetailsPage" className="option">
          option
          </a>

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
