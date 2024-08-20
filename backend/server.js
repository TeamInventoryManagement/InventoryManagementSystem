const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const { sql, poolPromise } = require('./db');

// Use CORS middleware
app.use(cors());

app.use(express.json());

// Route to handle employee addition
app.post('/employees', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { EmployeeID, FullName, Division, Email } = req.body;

        if (!EmployeeID || !FullName || !Division || !Email) {
            return res.status(400).send('All fields are required');
        }

        const query = `
            INSERT INTO Employees (EmployeeID, FullName, Division, Email, SysDate) 
            VALUES (@EmployeeID, @FullName, @Division, @Email, GETDATE())
        `;

        await pool.request()
            .input('EmployeeID', sql.VarChar(50), EmployeeID)
            .input('FullName', sql.VarChar(255), FullName)
            .input('Division', sql.VarChar(50), Division)
            .input('Email', sql.VarChar(50), Email)
            .query(query);

        res.status(201).send('Employee added successfully');
    } catch (err) {
        console.error('Error inserting employee:', err.message);
        res.status(500).send('Error inserting employee: ' + err.message);
    }
});

// app.post('/devices', async (req, res) => {
//   try {
//       const pool = await poolPromise;
//       const {
//           Device, DeviceID, AssetID, DeviceBrand, Model, SerialNumber, Processor,
//           InstalledRAM, SystemType, InvoiceNumber, PurchaseDate, PurchaseFrom, 
//           PurchaseAmount, Address, WarrentyExpierDate
//       } = req.body;

//       if (!Device || !DeviceID || !AssetID || !DeviceBrand || !Model || !SerialNumber) {
//           return res.status(400).send('Required fields are missing');
//       }

//       const query = `
//           INSERT INTO Devices (
//               Device, DeviceID, AssetID, DeviceBrand, Model, SerialNumber, Processor,
//               InstalledRAM, SystemType, InvoiceNumber, PurchaseDate, PurchaseFrom, 
//               PurchaseAmount, Address, WarrentyExpierDate, SysDate
//           ) 
//           VALUES (
//               @Device, @DeviceID, @AssetID, @DeviceBrand, @Model, @SerialNumber, @Processor,
//               @InstalledRAM, @SystemType, @InvoiceNumber, @PurchaseDate, @PurchaseFrom, 
//               @PurchaseAmount, @Address, @WarrentyExpierDate, GETDATE()
//           )
//       `;

//       await pool.request()
//           .input('Device', sql.VarChar(50), Device)
//           .input('DeviceID', sql.VarChar(50), DeviceID)
//           .input('AssetID', sql.VarChar(50), AssetID)
//           .input('DeviceBrand', sql.VarChar(50), DeviceBrand)
//           .input('Model', sql.VarChar(50), Model)
//           .input('SerialNumber', sql.VarChar(50), SerialNumber)
//           .input('Processor', sql.VarChar(50), Processor)
//           .input('InstalledRAM', sql.VarChar(50), InstalledRAM)
//           .input('SystemType', sql.VarChar(50), SystemType)
//           .input('InvoiceNumber', sql.VarChar(50), InvoiceNumber)
//           .input('PurchaseDate', sql.Date, PurchaseDate)
//           .input('PurchaseFrom', sql.VarChar(50), PurchaseFrom)
//           .input('PurchaseAmount', sql.Decimal(10, 2), PurchaseAmount)
//           .input('Address', sql.VarChar(50), Address)
//           .input('WarrentyExpierDate', sql.Date, WarrentyExpierDate)
//           .query(query);

//       res.status(201).send('Device added successfully');
//   } catch (err) {
//       console.error('Error inserting device:', err.message);
//       res.status(500).send('Error inserting device: ' + err.message);
//   }
// });

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
