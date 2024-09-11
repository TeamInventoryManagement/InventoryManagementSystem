import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './images/Altria-logo.png';
import "./Login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = useState(null); // New state for login success
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      setMessage(response.data.message);
      setIsLoginSuccess(true); // Set based on actual response condition
      if (response.data.message === 'Successfully logged in') {
        navigate('/HomePage');
      } else {
        setIsLoginSuccess(false);
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
      setIsLoginSuccess(false);
    }
  };
 
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Altria Logo" className="header-logo" />
        <div className="form1-group">
          <label>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form1-group">
          <label>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {message && <p className={`message ${isLoginSuccess ? 'success' : 'error'}`}>{message}</p>}
      </form>
    </div>
  );
};
 
export default Login;