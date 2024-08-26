import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const location = useLocation();

  // Define paths where the sidebar should not be displayed
  const noSidebarPaths = ["/", "/loginpage", "/registerpage"]; // Add your landing page and other routes where sidebar shouldn't appear

  // Check if the current path is in the noSidebarPaths list
  const hideSidebar = noSidebarPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="App" style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1, padding: hideSidebar ? "0" : "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
