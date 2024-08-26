const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db'); // Assuming you have a separate db.js file for database connection

const app = express();

app.use(cors());
app.use(express.json());

// Function to calculate warranty expiry date
function calculateWarrantyExpiryDate(purchaseDate, warentyMonths) {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + parseInt(warentyMonths, 10));
    return date.toISOString().split('T')[0]; 
}

// Route to handle device addition (inserts into both LaptopDetails and DeviceDetails)
app.post('/api/LaptopDetails', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            device, model, deviceBrand, assetId, processor, laptopId, installedRam,
            serialNumber, systemType, invoiceNumber, purchasedDate,
            purchasedAmount, address, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);

        if (!device || !model || !deviceBrand || !laptopId || !serialNumber || !assetId || !warentyMonths || !purchasedDate) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchasedDate, warentyMonths);

        // Query to insert data into LaptopDetails table
        const laptopDetailsQuery = `
            INSERT INTO LaptopDetails1 (
                Device, Model, DeviceBrand, AssetID, Processor, LaptopId, InstalledRAM, SerialNumber,
                SystemType, InvoiceNumber, PurchaseDate, PurchaseAmount, Address,
                WarentyMonths, WarrentyExpieryDate, SysDate
            ) VALUES (
                @Device, @Model, @DeviceBrand, @AssetID, @Processor, @LaptopId, @InstalledRAM, @SerialNumber,
                @SystemType, @InvoiceNumber, @PurchaseDate, @PurchaseAmount, @Address,
                @WarentyMonths, @WarrentyExpieryDate, GETDATE()
            )
        `;

        // Query to insert data into DeviceDetails table
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                Device, AssetID, DeviceBrand, DeviceID, Model, SerialNumber, SystemType, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @Device, @AssetID, @DeviceBrand, @LaptopId, @Model, @SerialNumber, @SystemType, @InvoiceNumber,
                @PurchaseDate, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', GETDATE()
            )
        `;

        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert into LaptopDetails
            await transaction.request()
                .input('Device', sql.VarChar(50), device)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('Processor', sql.VarChar(50), processor)
                .input('LaptopId', sql.VarChar(50), laptopId)
                .input('InstalledRAM', sql.VarChar(50), installedRam)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('SystemType', sql.VarChar(50), systemType)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchasedDate)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('Address', sql.VarChar(50), address)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .input('WarrentyExpieryDate', sql.Date, warrentyExpieryDate)
                .query(laptopDetailsQuery);

            console.log('Inserted into LaptopDetails table');

            // Insert into DeviceDetails
            await transaction.request()
                .input('Device', sql.VarChar(50), device)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('LaptopId', sql.VarChar(50), laptopId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('SystemType', sql.VarChar(50), systemType)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchasedDate)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .input('WarrentyExpieryDate', sql.Date, warrentyExpieryDate)
                .query(deviceDetailsQuery);

            console.log('Inserted into DeviceDetails table');

            await transaction.commit();

            res.status(201).send({ message: 'Device added successfully to both tables' });
        } catch (error) {
            console.error('Error during transaction, rolling back:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Error inserting data: ' + error.message });
        }
    } catch (err) {
        console.error('Error establishing connection or starting transaction:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});



// Route to get laptop details by Asset ID from LaptopDetails1 table
app.get('/api/laptop/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;

        console.log(`Fetching laptop details for Asset ID: ${assetId}`);

        const query = `
            SELECT Device, AssetID, DeviceBrand, LaptopId, Model, SerialNumber,
                   Processor, InstalledRAM, SystemType, InvoiceNumber, PurchaseDate,
                   PurchaseAmount, Address, WarentyMonths, WarrentyExpieryDate, SysDate
            FROM LaptopDetails1
            WHERE AssetID = @AssetID
        `;

        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);

        if (result.recordset.length > 0) {
            console.log('Laptop details found:', result.recordset[0]);
            res.status(200).json(result.recordset[0]);
        } else {
            console.log('Laptop not found.');
            res.status(404).send({ message: 'Laptop not found' });
        }
    } catch (err) {
        console.error('Error fetching laptop details:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});


//Retrieve data to the transfer page
// Route to fetch device details by Asset ID
app.get('/api/devices/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;

        console.log(`Fetching device details for Asset ID: ${assetId}`);
        
        const query = `
            SELECT Device, DeviceBrand, Model, SerialNumber, ConditionStatus, CurrentStatus 
            FROM DeviceDetails1 
            WHERE AssetID = @AssetID
        `;

        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);

        console.log('Query executed successfully. Result:', result.recordset);

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Device not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});


//Insert Employee details
// Route to handle employee addition
app.post('/api/employees', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { EmployeeID, FullName, Division, Email } = req.body;

        if (!EmployeeID || !FullName || !Division || !Email) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const query = `
            INSERT INTO Employees (EmployeeID, FullName, Division, Email)
            VALUES (@EmployeeID, @FullName, @Division, @Email)
        `;

        await pool.request()
            .input('EmployeeID', sql.VarChar(50), EmployeeID)
            .input('FullName', sql.VarChar(50), FullName)
            .input('Division', sql.VarChar(50), Division)
            .input('Email', sql.VarChar(50), Email)
            .query(query);

        res.status(201).send({ message: 'Employee added successfully' });
    } catch (error) {
        console.error('Error adding employee:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});

//Retrive employee details to the transfer form
// Route to fetch employee details by Employee ID
app.get('/api/employees/:employeeId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const employeeId = req.params.employeeId;

        const query = `
            SELECT EmployeeID, FullName, Division, Email
            FROM Employees
            WHERE EmployeeID = @EmployeeID
        `;

        const result = await pool.request()
            .input('EmployeeID', sql.VarChar(50), employeeId)
            .query(query);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send({ message: 'Employee not found' });
        }
    } catch (err) {
        console.error('Error fetching employee details:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});

// Insert into TransferDetails table 
app.post('/api/transfer', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId,
            device,
            deviceBrand,
            model,
            serialNumber,
            lapCondition,
            status,
            employeeId,
            division,
            fullName,
            email,
            issueDate,
            handoverDate
        } = req.body;

        console.log('Received transfer data:', req.body);

        if (!device || !assetId || !deviceBrand || !model || !serialNumber || !employeeId || !division || !fullName) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const transferQuery = `
                INSERT INTO TransferDetails (
                    AssetID, Device, DeviceBrand, Model, SerialNumber, LapCondition,
                    EmployeeID, FullName, Division, Email, Status, IssueDate, HandoverDate
                ) VALUES (
                    @AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @LapCondition,
                    @EmployeeID, @FullName, @Division, @Email, @Status, @IssueDate, @HandoverDate
                )
            `;

            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .input('Device', sql.VarChar(50), device)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('Model', sql.VarChar(50), model)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('LapCondition', sql.VarChar(50), lapCondition)
                .input('EmployeeID', sql.VarChar(50), employeeId)
                .input('FullName', sql.VarChar(50), fullName)
                .input('Division', sql.VarChar(50), division)
                .input('Email', sql.VarChar(50), email)
                .input('Status', sql.VarChar(50), status)
                .input('IssueDate', sql.Date, issueDate)
                .input('HandoverDate', sql.Date, handoverDate)
                .query(transferQuery);

            console.log('Inserted into TransferDetails table successfully');

            // Update the CurrentStatus to 'In-Use' in DeviceDetails1 table
            const updateStatusQuery = `
                UPDATE DeviceDetails1
                SET CurrentStatus = 'In-Use'
                WHERE AssetID = @AssetID
            `;

            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateStatusQuery);

            console.log('Updated DeviceDetails1 CurrentStatus to In-Use');

            await transaction.commit();

            res.status(201).send({ message: 'Transfer successful and status updated' });
        } catch (error) {
            console.error('Error during transaction, rolling back:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Error during transfer: ' + error.message });
        }
    } catch (error) {
        console.error('Error establishing connection or starting transaction:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});



// sql.connect(config, (err) => {
//     if (err) {
//       console.error('Database connection failed: ', err);
//     } else {
//       console.log('Connected to database');
//       sql.query('SELECT * FROM LaptopDetails', (err, result) => {
//         if (err) {
//           console.error('Error querying database: ', err);
//         } else {
//           console.log('Query result: ', result.recordset);
//         }
//       });
//     }
//   });
// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
