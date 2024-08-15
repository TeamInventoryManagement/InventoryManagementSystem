import React, { useState } from "react";
import logo from './images/Altria-logo.png';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your login logic here
    console.log("Logging in with", email, password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
      <img src={logo} alt="Altria Logo" className="header-logo" />
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Value"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Value"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Sign In
        </button>
        <a href="/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>
      </form>
    </div>
  );
};

export default Login;
