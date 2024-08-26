import React, { useState } from "react";
import logo from './images/Altria-logo.png';
import "./RegisterForm.css";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userRole,
        }),
      });

      if (response.ok) {
        setMessage('User registered successfully');
        // Clear form fields after successful submission
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUserRole('');
      } else {
        const errorMessage = await response.text();
        setMessage(`Failed to register user: ${errorMessage}`);
      }
    } catch (error) {
      setMessage('Error registering user: ' + error.message);
    }
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
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="userRole">User Role</label>
          <select
            id="userRole"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="">Select User Role</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
        {message && <p>{message}</p>}

        <a href="/loginpage" className="login-link">
          User Login
        </a>
      </form>
    </div>
  );
};

export default RegisterForm;
