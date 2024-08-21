const express = require('express');
const cors = require('cors');
const app = express();
const { sql, poolPromise } = require('./db');

app.use(cors());
app.use(express.json());

// Route to handle employee addition
app.post('/api/employees', async (req, res) => {
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

// Function to calculate warranty expiry date
function calculateWarrantyExpiryDate(purchaseDate, warentyMonths) {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + parseInt(warentyMonths, 10));
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Route to handle device addition
app.post('/api/devices', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            device, model, fullName, assetId, processor, deviceId, installedRam,
            serialNumber, systemType, invoiceNumber, purchasedDate, purchasedFrom,
            purchasedAmount, address, warentyMonths
        } = req.body;

        if (!device || !model || !fullName || !deviceId || !serialNumber || !assetId || !warentyMonths || !purchasedDate) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchasedDate, warentyMonths);

        const query = `
            INSERT INTO [Device] (
                Device, Model, DeviceBrand, AssetID, Processor, DeviceID, InstalledRAM, SerialNumber,
                SystemType, InvoiceNumber, PurchaseDate, PurchaseFrom, PurchaseAmount, Address,
                WarentyMonths, WarrentyExpieryDate, SysDate
            ) VALUES (
                @Device, @Model, @DeviceBrand, @AssetID, @Processor, @DeviceID, @InstalledRAM, @SerialNumber,
                @SystemType, @InvoiceNumber, @PurchaseDate, @PurchaseFrom, @PurchaseAmount, @Address,
                @WarentyMonths, @WarrentyExpieryDate, GETDATE()
            )
        `;

        await pool.request()
            .input('Device', sql.VarChar(50), device)
            .input('Model', sql.VarChar(50), model)
            .input('DeviceBrand', sql.VarChar(50), fullName)  // Assuming fullName refers to DeviceBrand
            .input('AssetID', sql.VarChar(50), assetId)
            .input('Processor', sql.VarChar(50), processor)
            .input('DeviceID', sql.VarChar(50), deviceId)
            .input('InstalledRAM', sql.VarChar(50), installedRam)
            .input('SerialNumber', sql.VarChar(50), serialNumber)
            .input('SystemType', sql.VarChar(50), systemType)
            .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
            .input('PurchaseDate', sql.Date, purchasedDate)
            .input('PurchaseFrom', sql.VarChar(50), purchasedFrom)
            .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
            .input('Address', sql.VarChar(50), address)
            .input('WarentyMonths', sql.Int, warentyMonths)
            .input('WarrentyExpieryDate', sql.Date, warrentyExpieryDate)
            .query(query);

        res.status(201).send({ message: 'Device added successfully' });
    } catch (err) {
        console.error('Error inserting device:', err.message);
        res.status(500).send({ error: 'Error inserting device: ' + err.message });
    }
});



// Route to get device details by Asset ID
app.get('/api/devices/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { assetId } = req.params;

        const query = `
            SELECT Device, DeviceBrand, Model, SerialNumber, ConditionStatus, CurrentStatus 
            FROM [Device] 
            WHERE AssetID = @AssetID
        `;

        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('Device not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching device details:', err.message);
        res.status(500).send('Error fetching device details: ' + err.message);
    }
});

// Route to get employee details by Employee ID
app.get('/api/employees/:employeeId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { employeeId } = req.params;

        const query = `
            SELECT EmployeeID, FullName, Division, Email 
            FROM Employees 
            WHERE EmployeeID = @EmployeeID
        `;

        const result = await pool.request()
            .input('EmployeeID', sql.VarChar(50), employeeId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('Employee not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching employee details:', err.message);
        res.status(500).send('Error fetching employee details: ' + err.message);
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
