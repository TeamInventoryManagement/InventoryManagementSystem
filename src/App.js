import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const location = useLocation();

  // Check if the current path is "/login"
  const isLoginPage = location.pathname === "/loginPage";

  return (
    <div className="App" style={{ display: "flex" }}>
      {!isLoginPage && <Sidebar />}
      <div style={{ flex: 1, padding: isLoginPage ? "0" : "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
