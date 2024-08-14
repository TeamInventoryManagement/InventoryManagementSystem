import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar component
import './styles.css';

function Login() {
  return (
    <div className="App">
 {/* Include the Navbar component */}
      <header className="App-header">
        <h1>LOGIN</h1>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">UserName</label>
            <input type="email" id="username" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="login-button">LOGIN</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
