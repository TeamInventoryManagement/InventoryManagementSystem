import React, { useState } from "react";
import "./EmployeeDetails.css";

const EmployeeDetails = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState("");
  const [email, setEmail] = useState("");

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching for employee with ID:", employeeId);
  };

  const handleNew = () => {
    // Implement the logic for creating a new employee
    console.log("Creating new employee");
  };

  const handleDelete = () => {
    // Implement the logic for deleting an employee
    console.log("Deleting employee with ID:", employeeId);
  };

  return (
    <div className="employee-details">
      <div className="search-bar-container">
        <div className="search-bar">
          <i className="fas fa-bars"></i>
          <input
            type="text"
            placeholder="Search by employee id"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <i className="fas fa-search search-icon" onClick={handleSearch}></i>
        </div>
        <button className="btn new-btn" onClick={handleNew}>
          <i className="fas fa-plus"></i> New
        </button>
        <button className="btn delete-btn" onClick={handleDelete}>
          <i className="fas fa-trash-alt"></i> Delete
        </button>
      </div>

      <div className="employee-details-title">
        <i className="fas fa-id-badge"></i> Employee Details
      </div>

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
            {/* Add more options as needed */}
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
    </div>
  );
};

export default EmployeeDetails;
