import React from "react";
import "./LandingPage.css";
import logo from "./images/Altria-logo.png"; // Adjust the path to your logo image

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logo} alt="Altria Logo" className="landing-logo" />
        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#signup">Sign Up</a>
          <a href="#login" className="login-btn">
            Login
          </a>
        </nav>
      </header>

      <main className="landing-main">
        <h1>Laptop Management System</h1>
        <div className="landing-illustration">
          <img
            src="https://via.placeholder.com/400" // Replace with the correct image URL or local path
            alt="Laptop Management Illustration"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
