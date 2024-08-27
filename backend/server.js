const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('./db'); 

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
        console.log(`check`);
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
        console.log(`check`);
        console.log(`Fetching Employee details for Employee ID:' ${employeeId}`);

        const query1 = `
            SELECT EmployeeID, FullName, Division, Email
            FROM Employees
            WHERE EmployeeID = @EmployeeID
        `;

        
        const result1 = await pool.request()
            .input('EmployeeID', sql.VarChar(50), employeeId)
            .query(query1);

        console.log('Query executed successfully. Result:', result1.recordset);

        if (result1.recordset.length > 0) {
            console.info('record found');
            res.status(200).json(result1.recordset[0]);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (err) {
        console.log(result1.recordset[1]);
        console.error('Error fetching employee details:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/transfer/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;

        const query = `
            SELECT * FROM TransferDetails WHERE AssetID = @AssetID
        `;

        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Error fetching transfer details:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});


//Insert Transfer details
// Route to handle transfer details
app.post('/api/Transfer', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
        assetId,device,deviceBrand,model,serialNumber,conditionStatus,employeeId, fullName, division, email
        } = req.body;

        console.log('Received form _data:', req.body);

        const transactionquery = `
            INSERT INTO TransferDetails (AssetID,Device,DeviceBrand,Model,SerialNumber,ConditionStatus,EmployeeID, FullName, Division, Email,issueDate,CurrentStatus)
            VALUES (@AssetID,@Device,@DeviceBrand,@Model,@SerialNumber,@conditionStatus,@EmployeeID, @FullName, @Division, @Email,GETDATE(),'In-Use')
        `;

        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert into Transer Table
            await transaction.request()
                .input('Device', sql.VarChar(50), device)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('conditionStatus', sql.VarChar(50), conditionStatus)
                .input('EmployeeID', sql.VarChar(50), employeeId)
                .input('FullName', sql.VarChar(50), fullName)
                .input('Division', sql.VarChar(50), division)
                .input('Email', sql.VarChar(50), email)   
                .query(transactionquery);

        console.log('Inserted into Transfer table');

            // Update DeviceDetails Table
          const updateDeviceQuery = `
                UPDATE DeviceDetails1
                SET CurrentStatus = 'In-Use'
                WHERE AssetID = @AssetID  
            `;

           await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceQuery);


        console.log('Update into DeviceDetails table');

        await transaction.commit();


        res.status(201).send({ message: 'Transfer added successfully' });
        } catch (error) {
            console.error('Error during transaction:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Server error: ' + error.message });
        }

    } catch (error) {
        console.error('Error adding employee:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});





//hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh


// app.post('/api/repair', async (req, res) => {
//     console.log("Received data:", req.body);
//     try {
//         const pool = await poolPromise;
//         const { assetId, device, deviceName, model, serialNumber, repairStatus, invoiceNumber, vendor, issueDate, receivedDate, repairCost } = req.body;
        
//         const query = `INSERT INTO IssueTracker (AssetID, Device, DeviceBrand, Model, SerialNumber, RepairStatus, InvoiceNumber, Vendor, IssueDateToVendor, RecievedDatefromVendor, RepairCost) VALUES (@AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @RepairStatus, @InvoiceNumber, @Vendor, @IssueDateToVendor, @RecievedDatefromVendor, @RepairCost)`;

//         await pool.request()
//             .input('AssetID', sql.VarChar(50), assetId)
//             .input('Device', sql.VarChar(50), device)
//             .input('DeviceBrand', sql.VarChar(50), deviceName)
//             .input('Model', sql.VarChar(50), model)
//             .input('SerialNumber', sql.VarChar(50), serialNumber)
//             .input('RepairStatus', sql.VarChar(50), repairStatus)
//             .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
//             .input('Vendor', sql.VarChar(50), vendor)
//             .input('IssueDateToVendor', sql.Date, issueDate)
//             .input('ReceivedDate', sql.Date, receivedDate)  // Corrected column name
//             .input('RepairCost', sql.Decimal(10, 2), repairCost)
//             .query(query);


//         res.status(201).send({ message: 'Repair data added successfully' });
//     } catch (error) {
//         console.error('Error adding repair data:', error);
//         res.status(500).send({ error: 'Server error: ' + error.message });
//         console.log(req.body);  // Log the received data for debugging
//     }
// });



app.post('/api/repair', async (req, res) => {
    console.log("Received data:", req.body);
    try {
        const pool = await poolPromise;
        const { assetId, device, deviceName, model, serialNumber, repairStatus, invoiceNumber, vendor, issueDate, receivedDate, repairCost } = req.body;
        
        const query = `
    INSERT INTO IssueTracker (
        AssetID, Device, DeviceBrand, Model, SerialNumber, RepairStatus, 
        InvoiceNumber, Vendor, IssueDateToVendor, ReceivedDateFromVendor, RepairCost
    ) VALUES (
        @AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @RepairStatus, 
        @InvoiceNumber, @Vendor, @IssueDateToVendor, @ReceivedDateFromVendor, @RepairCost
    )`;

await pool.request()

    .input('AssetID', sql.VarChar(50), assetId)
    .input('Device', sql.VarChar(50), device)
    .input('DeviceBrand', sql.VarChar(50), deviceName)
    .input('Model', sql.VarChar(50), model)
    .input('SerialNumber', sql.VarChar(50), serialNumber)
    .input('RepairStatus', sql.VarChar(50), repairStatus)
    .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
    .input('Vendor', sql.VarChar(50), vendor)
    .input('IssueDateToVendor', sql.Date, issueDate)
    .input('ReceivedDateFromVendor', sql.Date, receivedDate)
    .input('RepairCost', sql.Decimal(10, 2), repairCost)
    .query(query);

        res.status(201).send({ message: 'Repair data added successfully' });
    } catch (error) {
        console.error('Failed to process repair data:', error);
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