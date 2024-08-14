import React, { useState } from "react";

const RepairForm = () => {
  const [device, setDevice] = useState("");
  const [assetId, setAssetId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [vendor, setVendor] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [repairCost, setRepairCost] = useState("");

  // Mock function to simulate autofill based on Device and Asset ID
  const handleAutoFill = () => {
    if (device === "Laptop" && assetId === "0004") {
      setDeviceName("LAP-0088");
      setModel("HP Probook Notebook");
      setSerialNumber("123456789");
    } else {
      // Reset fields if conditions do not match
      setDeviceName("");
      setModel("");
      setSerialNumber("");
    }
  };

  // Call the auto-fill function whenever device or assetId changes
  React.useEffect(() => {
    handleAutoFill();
  }, [device, assetId]);

  return (
    <form>
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <select value={device} onChange={(e) => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="Laptop">Laptop</option>
          {/* Add more options as needed */}
        </select>
        <input
          type="text"
          placeholder="Asset ID"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Device Name"
          value={deviceName}
          readOnly
        />
        <input
          type="text"
          placeholder="Asset ID"
          value={assetId}
          readOnly
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <input type="text" placeholder="Model" value={model} readOnly />
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          readOnly
        />
      </div>

      <hr />
      <h3>Repair Details</h3>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <select
          value={repairStatus}
          onChange={(e) => setRepairStatus(e.target.value)}
        >
          <option value="">Select Repair Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          {/* Add more options as needed */}
        </select>
        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <input
          type="date"
          placeholder="Issued Date to Vendor"
          value={issuedDate}
          onChange={(e) => setIssuedDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Received Date from Vendor"
          value={receivedDate}
          onChange={(e) => setReceivedDate(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Repair Cost (LKR)"
          value={repairCost}
          onChange={(e) => setRepairCost(e.target.value)}
        />
        <button type="submit">Update</button>
      </div>
    </form>
  );
};

export default RepairForm;
