import React, { useState } from "react";
import "./EmployeeDetails.css";
import searchIcon from './images/Search_icon.png';  // Ensure you have the correct path for the image
 
const EmployeeDetails = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");  // To display success/error messages
 
  const handleSearch = async () => {
    setMessage("");  // Reset message
 
    if (!employeeId) {
      setMessage("Please enter an Employee ID to search.");
      return;
    }
 
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (response.ok) {
        const data = await response.json();
        setFullName(data.FullName);
        setDivision(data.Division);
        setEmail(data.Email);
        setMessage('Employee details retrieved successfully');
      } else {
        const errorMessage = await response.json();
        setMessage(`Failed to retrieve employee details: ${errorMessage.message}`);
      }
    } catch (error) {
      setMessage('Error retrieving employee details: ' + error.message);
    }
  };
 
  const handleNew = async () => {
    setMessage("");  // Reset message
    if (!employeeId || !fullName || !division || !email) {
      setMessage("All fields are required.");
      return;
    }
 
    try {
      const response = await fetch('http://localhost:3000/api/employees', {  // Replace 3000 with your server port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmployeeID: employeeId,
          FullName: fullName,
          Division: division,
          Email: email,
        }),
      });
 
      if (response.ok) {
        setMessage('Employee added successfully');
        // Clear form fields after successful submission
        setEmployeeId('');
        setFullName('');
        setDivision('');
        setEmail('');
      } else {
        const errorMessage = await response.text();
        setMessage(`Failed to add employee: ${errorMessage}`);
      }
    } catch (error) {
      setMessage('Error adding employee: ' + error.message);
    }
  };
 
  return (
    <div>
      <div className="search-bar-container" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by employee id"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              outline: 'none',
              width: '200px'
            }}
          />
        </div>
        <div className="employee-details">
      <button type="button" className="search-button" onClick={handleSearch}>
        <img
          src={searchIcon}
          alt="Search"
          style={{width:'20px', height:'20px', marginLeft: '-90px', marginBottom: '-5px', border: 'none', background: 'none', cursor: 'pointer'}}
        />
      </button>
      </div>
    </div>
 
      <h1 className="Employee">Employee Details</h1>
      <br></br>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            id="employeeId"
            type="text"
            placeholder="Value"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Value"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="division">Division</label>
          <select
            id="division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="text"
            placeholder="Value"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
 
      <div className="form-row action-buttons">
        <button type="button" className="Add-btn" onClick={handleNew}>
          Add
        </button>
      </div>
 
      {message && <p>{message}</p>}
    </div>
  );
};
 
export default EmployeeDetails;