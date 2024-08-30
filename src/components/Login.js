// import React, { useState } from "react";
// import logo from './images/Altria-logo.png';
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordShown, setPasswordShown] = useState(false);

//   const togglePasswordVisibility = () => {
//     setPasswordShown(!passwordShown);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login button clicked");
//     console.log("Logging in with", email, password);
//     fetch('/api/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         console.log("sucees login");
//         window.location.href = '/HomePage';  // Redirect to the homepage on successful login
//       } else {
//         alert('Invalid credentials');    // Alert the user on failed login attempt
//       }
//     });
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <img src={logo} alt="Altria Logo" className="header-logo" />
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             type={passwordShown ? "text" : "password"}
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button type="button" onClick={togglePasswordVisibility}>
//             {passwordShown ? 'Hide' : 'Show'}
//           </button>
//         </div>
//         <button type="submit" className="login-button">Login</button>
//         <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      if (response.data.success) {
        // Save token to localStorage or context
        localStorage.setItem('token', response.data.token);
        // Redirect to the form page
        navigate('/HomePage');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          
        </form>
      </div>
    </div>
  );
  
};

export default Login;
