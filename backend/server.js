const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('./db'); 
const jwt = require('jsonwebtoken');


const app = express();

app.use(cors());
app.use(express.json());



// Function to calculate warranty expiry date
function calculateWarrantyExpiryDate(purchaseDate, warentyMonths) {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + parseInt(warentyMonths, 10));
    return date.toISOString().split('T')[0]; 
}

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM UserDetails WHERE Email = @email');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (password === user.Password) {
                // User is successfully authenticated, but no token is returned.
                res.json({ message: 'Successfully logged in' });
            } else {
                res.status(401).send('Authentication failed');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server error');
    }
});

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



app.put('/api/LaptopUpdate', async (req, res) => {
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
        const updatelaptopDetailsQuery = `
            UPDATE LaptopDetails1 SET
                Device=@Device, Model=@Model, DeviceBrand=@DeviceBrand, Processor=@Processor, 
                LaptopId=@LaptopId, InstalledRAM=@InstalledRAM, SerialNumber=@SerialNumber,
                SystemType=@SystemType, InvoiceNumber=@InvoiceNumber, PurchaseDate=@PurchaseDate, 
                PurchaseAmount=@PurchaseAmount, Address=@Address,
                WarentyMonths=@WarentyMonths, WarrentyExpieryDate=@WarrentyExpieryDate
                WHERE AssetID=@AssetID`;

        // Query to insert data into DeviceDetails table
        const updatedeviceDetailsQuery = `
            UPDATE DeviceDetails1 SET
                Device=@Device, DeviceBrand=@DeviceBrand, DeviceID=@LaptopId, Model=@Model, 
                SerialNumber=@SerialNumber, SystemType=@SystemType, InvoiceNumber=@InvoiceNumber,
                PurchaseDate=@PurchaseDate, PurchaseAmount=@PurchaseAmount, WarentyMonths=@WarentyMonths, 
                WarrentyExpieryDate=@WarrentyExpieryDate
                WHERE AssetID=@AssetID`;

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
                .query(updatelaptopDetailsQuery);

            console.log('Updated into Laptop Details table');

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
                .query(updatedeviceDetailsQuery);

            console.log('Updated into Device Details table');

            await transaction.commit();

            res.status(201).send({ message: 'Updated Device successfully to both tables' });
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



app.post('/api/LaptopDelete', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId,model
        } = req.body;

        console.log('Received form data:', req.body);

        if (!model || !assetId) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Query to insert data into LaptopDetails table
        const deletelaptopDetailsQuery = `
            DELETE FROM LaptopDetails1 WHERE AssetID=@AssetID`;

        // Query to insert data into DeviceDetails table
        const deletedeviceDetailsQuery = `
            DELETE FROM DeviceDetails1 WHERE AssetID=@AssetID`;

        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert into LaptopDetails
            await transaction.request()
                .input('Model', sql.VarChar(50), model)
                .input('AssetID', sql.VarChar(50), assetId)
                .query(deletelaptopDetailsQuery);

            console.log('Deleted Laptop Details table');

            // Insert into DeviceDetails
            await transaction.request()
                .input('Model', sql.VarChar(50), model)
                .input('AssetID', sql.VarChar(50), assetId)
                .query(deletedeviceDetailsQuery);

            console.log('Deleted Device Details table');

            await transaction.commit();

            res.status(201).send({ message: 'Deleted Device successfully to both tables' });
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
            assetId, device, deviceBrand, model, serialNumber, conditionStatus, employeeId, fullName, division, email
        } = req.body;

        console.log('Received form data:', req.body);

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Check if there's already an 'In-Use' record for this AssetID
            const checkQuery = `
                SELECT COUNT(*) AS count 
                FROM TransferDetails 
                WHERE AssetID = @AssetID AND CurrentStatus = 'In-Use'
            `;

            const checkResult = await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(checkQuery);

            const inUseCount = checkResult.recordset[0].count;

            if (inUseCount > 0) {
                await transaction.rollback();
                return res.status(400).send({ error: 'This asset is already marked as "In-Use" in the Transfer table.' });
            }

            // Insert into TransferDetails table
            const insertQuery = `
                INSERT INTO TransferDetails 
                (AssetID, Device, DeviceBrand, Model, SerialNumber, ConditionStatus, EmployeeID, FullName, Division, Email, issueDate, CurrentStatus)
                VALUES 
                (@AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @ConditionStatus, @EmployeeID, @FullName, @Division, @Email, GETDATE(), 'In-Use')
            `;

            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .input('Device', sql.VarChar(50), device)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('Model', sql.VarChar(50), model)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('ConditionStatus', sql.VarChar(50), conditionStatus)
                .input('EmployeeID', sql.VarChar(50), employeeId)
                .input('FullName', sql.VarChar(50), fullName)
                .input('Division', sql.VarChar(50), division)
                .input('Email', sql.VarChar(50), email)
                .query(insertQuery);

            console.log('Inserted into Transfer table');

            // Update DeviceDetails table
            const updateDeviceQuery = `
                UPDATE DeviceDetails1
                SET CurrentStatus = 'In-Use'
                WHERE AssetID = @AssetID  
            `;

            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceQuery);

            console.log('Updated DeviceDetails table');

            await transaction.commit();

            res.status(201).send({ message: 'Transfer added successfully' });
        } catch (error) {
            console.error('Error during transaction:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Server error: ' + error.message });
        }
    } catch (error) {
        console.error('Error adding transfer:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});

 

app.post('/api/Handover', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
        assetId
        } = req.body;

        console.log('Received form _data:', req.body);

        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            // Update DeviceDetails Table
          const updateDeviceQuery = `
                UPDATE TransferDetails
                SET CurrentStatus = 'Handover',
                HandoverDate = GETDATE()
                WHERE AssetID = @AssetID and  CurrentStatus = 'In-Use'
            `;

           await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceQuery);


        console.log('Updated into DeviceDetails table');

        await transaction.commit();

        res.status(201).send({ message: 'Update Transfer Table record successfully' });
        } catch (error) {
            console.error('Error during transaction:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Server error: ' + error.message });
        }

    } catch (error) {
        console.error('Error update transfer record:', error.message);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});



app.post('/api/repair', async (req, res) => {
    console.log("Received data:", req.body);

    try {
        const pool = await poolPromise;
        const { assetId, device, deviceBrand, model, serialNumber, repairStatus, repairInvoiceNumber, vendor, 
        issueDate, receivedDate, repairCost } = req.body;
        
    const repairquery = `
    INSERT INTO IssueTracker (
        AssetID, Device, DeviceBrand, Model, SerialNumber, RepairStatus, 
        InvoiceNumber, Vendor, IssueDateToVendor, ReceivedDatefromVendor, RepairCost
    ) VALUES (
        @AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @RepairStatus, 
        @InvoiceNumber, @Vendor, @IssueDateToVendor, @ReceivedDateFromVendor, @RepairCost
    )`;

    // Execute the queries within a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    await transaction.request()
        .input('AssetID', sql.VarChar(50), assetId)
        .input('Device', sql.VarChar(50), device)
        .input('DeviceBrand', sql.VarChar(50), deviceBrand)
        .input('Model', sql.VarChar(50), model)
        .input('SerialNumber', sql.VarChar(50), serialNumber)
        .input('RepairStatus', sql.VarChar(50), repairStatus)
        .input('InvoiceNumber', sql.VarChar(50), repairInvoiceNumber || null)
        .input('Vendor', sql.VarChar(50), vendor || null)
        .input('IssueDateToVendor', sql.Date, issueDate || null)
        .input('ReceivedDateFromVendor', sql.Date, receivedDate || null)
        .input('RepairCost', sql.Decimal(10, 2), repairCost || null)
        .query(repairquery);

        await transaction.commit();

        res.status(201).send({ message: 'Repair data added successfully' });
    } catch (error) {
        console.error('Failed to process repair data:', error);
        res.status(500).send({ error: 'Server error: ' + error.message });
    }
});


app.get('/api/InUse', async (req, res) => {
    try {
        const pool = await poolPromise;
        
        console.log(`check`);
        console.log(`Fetching device details`);
        
        const inusequery = `
            SELECT AssetID, Device, DeviceBrand, Model, SerialNumber, ConditionStatus, CurrentStatus 
            FROM DeviceDetails1
        `;

        const result = await pool.request()
            .query(inusequery);

        console.log('Query executed successfully. Result:', result.recordset);

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).send('Device not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});



app.get('/api/TransferDevices', async (req, res) => {
    try {
        const pool = await poolPromise;
        
        console.log(`Fetching transfer devices`);
        
        const transferdetailsquery = `
            SELECT AssetID, Device, DeviceBrand, Model, SerialNumber, ConditionStatus, EmployeeID,FullName,
            Division, IssueDate, HandoverDate AS HandoverDate, CurrentStatus 
            FROM TransferDetails
        `;

        const result = await pool.request()
            .query(transferdetailsquery);

        console.log('Query executed successfully. Result:', result.recordset);

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).send('Devices are not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});



// accessories
app.post('/api/accessories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, model, deviceBrand, assetId,
            serialNumber, invoiceNumber, purchaseDate,
            purchasedAmount, warentyMonths
        } = req.body;
 
        console.log('Received form data:', req.body);
 
 
 
        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);
 
        const accessoriesDetailsQuery = `
            INSERT INTO Accessories (
                Model, DeviceBrand, AssetID, AssetType, SerialNumber,
                InvoiceNumber, PurchaseDate, PurchaseAmount,
                WarentyMonths, WarrentyExpieryDate, SysDate
            ) VALUES (
                @Model, @DeviceBrand, @AssetID, @AccessoriesType, @SerialNumber,
                @InvoiceNumber, @PurchaseDate, @PurchaseAmount,
                @WarentyMonths, @WarrentyExpieryDate, GETDATE()
            )
        `;
 
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                AssetID, Device, DeviceBrand, Model, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @AssetID, @AccessoriesType, @DeviceBrand, @Model, @SerialNumber, @InvoiceNumber,
                @PurchaseDate, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', GETDATE()
            )
        `;
 
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
 
        try {
            // Insert into accessories table
            await transaction.request()
                .input('AccessoriesType', sql.VarChar(255), accessoriesType)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .input('WarrentyExpieryDate', sql.Date, warrentyExpieryDate)
                .query(accessoriesDetailsQuery);
 
            console.log('Inserted into LaptopDetails table');
 
            // Insert into DeviceDetails
            await transaction.request()
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('AccessoriesType', sql.VarChar(255), accessoriesType)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
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
 
// networkEquipment
app.post('/api/networkEquipment', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, model, deviceBrand, assetId, macID, deviceId,
            serialNumber, invoiceNumber, purchasedCompnay, purchaseDate,
            purchasedAmount, warentyMonths
        } = req.body;
 
        console.log('Received form data:', req.body);
 
 
 
        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);
 
        const networkEquipmentsQuery = `
            INSERT INTO NetworkEquipments (
                Model, DeviceBrand, AssetType, AssetID, MACAddress, DeviceID, SerialNumber,
                InvoiceNumber, PurchasedCompnay, PurchaseDate, PurchaseAmount,
                WarentyMonths, SysDate
            ) VALUES (
                @Model, @DeviceBrand, @AccessoriesType, @AssetID, @MACAddress,
                @DeviceID, @SerialNumber,
                @InvoiceNumber, @PurchasedCompnay, @PurchaseDate, @PurchaseAmount,
                @WarentyMonths, GETDATE()
            )
        `;
 
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                AssetID, Device,DeviceBrand, DeviceID, Model, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @AssetID, @AccessoriesType, @DeviceBrand, @DeviceID, @Model, @SerialNumber, @InvoiceNumber,
                @PurchaseDate, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', GETDATE()
            )
        `;
 
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
 
        try {
            // Insert into networkEquipment
            await transaction.request()
                .input('AccessoriesType', sql.VarChar(255), accessoriesType)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('MACAddress', sql.VarChar(50), macID)
                .input('DeviceID', sql.VarChar(50), deviceId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchasedCompnay',sql.VarChar(50), purchasedCompnay)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .query(networkEquipmentsQuery);
 
            console.log('Inserted into LaptopDetails table');
 
            // Insert into DeviceDetails
            await transaction.request()
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AccessoriesType', sql.VarChar(50), accessoriesType)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('DeviceID', sql.VarChar(50), deviceId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
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


app.get('/api/totalDevicesByBrand', async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = `
            SELECT DeviceBrand, COUNT(*) as TotalDevices
            FROM DeviceDetails1
            where device= 'Laptop'
            GROUP BY DeviceBrand
        `;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: 'Error fetching data: ' + err.message });
    }
});
 
app.get('/api/countByStatus', async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = `
            SELECT CurrentStatus, COUNT(*) as count
            FROM DeviceDetails1
            where device= 'Laptop'
            GROUP BY CurrentStatus
        `;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send({ error: 'Error fetching data: ' + err.message });
    }
});
 
app.get('/api/devicesCount', async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = `
             SELECT device, COUNT(*) as count
            FROM DeviceDetails1
            where device not in ('Laptop')
            GROUP BY device`;
               
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send({ error: 'Error fetching data: ' + err.message });
    }
});
 
app.get('/api/conditionStatus', async (req, res) => {
    try {
        const pool = await poolPromise;
        const query = `
           SELECT ConditionStatus, COUNT(*) as TotalCondition
            FROM DeviceDetails1
            where device= 'Laptop'
            GROUP BY ConditionStatus`;
               
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send({ error: 'Error fetching data: ' + err.message });
    }
});
 
 
app.get('/api/totalLaptopCount', async (req, res) => {
    try {
        // Assuming `poolPromise` is your SQL connection pool promise
        const pool = await poolPromise;
       
        // The SQL query to count laptops
        const query = `
            SELECT COUNT(*) AS count
            FROM DeviceDetails1
            WHERE device = 'Laptop'`;
       
        // Execute the query
        const result = await pool.request().query(query);
       
        // Respond with the count of laptops
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching total laptop count:', err.message);
        res.status(500).send({ error: 'Error fetching total laptop count: ' + err.message });
    }
});
 
  app.get('/api/totalDevicesCount', async (req, res) => {
    try {
        // Assuming `poolPromise` is your SQL connection pool promise
        const pool = await poolPromise;
       
        // The SQL query to count laptops
        const query = `
            SELECT COUNT(*) AS count FROM DeviceDetails1`;
       
        // Execute the query
        const result = await pool.request().query(query);
       
        // Respond with the count of laptops
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching total laptop count:', err.message);
        res.status(500).send({ error: 'Error fetching total laptop count: ' + err.message });
    }
});
 
 
app.get('/api/totalAccesoriesCount', async (req, res) => {
    try {
        // Assuming `poolPromise` is your SQL connection pool promise
        const pool = await poolPromise;
       
        // The SQL query to count laptops
        const query = `
            SELECT COUNT(*) AS count FROM Accessories`;
       
        // Execute the query
        const result = await pool.request().query(query);
       
        // Respond with the count of laptops
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching total laptop count:', err.message);
        res.status(500).send({ error: 'Error fetching total laptop count: ' + err.message });
    }
});
 
 
app.get('/api/totalNetworkEquipments', async (req, res) => {
    try {
        // Assuming `poolPromise` is your SQL connection pool promise
        const pool = await poolPromise;
       
        // The SQL query to count laptops
        const query = `
            SELECT COUNT(*) AS count FROM NetworkEquipments`;
       
        // Execute the query
        const result = await pool.request().query(query);
       
        // Respond with the count of laptops
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching total laptop count:', err.message);
        res.status(500).send({ error: 'Error fetching total laptop count: ' + err.message });
    }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});