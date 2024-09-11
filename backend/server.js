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
            serialNumber, systemType, invoiceNumber, screenSize, purchasedDate, resolution, purchaseCompany,
            purchasedAmount, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);

        if (!device || !model || !deviceBrand || !laptopId || !serialNumber || !assetId || !warentyMonths || !purchasedDate || !purchaseCompany || !screenSize || !resolution) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchasedDate, warentyMonths);

        // Query to insert data into LaptopDetails table
        const laptopDetailsQuery = `
            INSERT INTO LaptopDetails1 (
                Device, Model, DeviceBrand, AssetID, Processor, LaptopId, InstalledRAM, SerialNumber,
                SystemType, InvoiceNumber, ScreenSize, PurchaseDate, Resolution, PurchaseAmount, PurchaseCompany,
                WarentyMonths, WarrentyExpieryDate, SysDate
            ) VALUES (
                @Device, @Model, @DeviceBrand, @AssetID, @Processor, @LaptopId, @InstalledRAM, @SerialNumber,
                @SystemType, @InvoiceNumber, @ScreenSize, @PurchaseDate, @Resolution, @PurchaseAmount, @PurchaseCompany,
                @WarentyMonths, @WarrentyExpieryDate, GETDATE()
            )
        `;


        // Query to insert data into DeviceDetails table
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                Device, AssetID, DeviceBrand, DeviceID, Model, SerialNumber, SystemType, InvoiceNumber,
                PurchaseDate, PurchaseAmount, PurchaseCompany, WarentyMonths, WarrentyExpieryDate, CurrentStatus,
                ConditionStatus, SysDate
            ) VALUES (
                @Device, @AssetID, @DeviceBrand, @LaptopId, @Model, @SerialNumber, @SystemType, @InvoiceNumber,
                @PurchaseDate, @PurchaseAmount, @PurchaseCompany, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock',
                'Brand-New', GETDATE()
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
                .input('ScreenSize', sql.VarChar(50), screenSize)
                .input('PurchaseDate', sql.Date, purchasedDate)
                .input('Resolution', sql.VarChar(50), resolution)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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
            serialNumber, systemType, invoiceNumber, screenSize, purchasedDate, resolution, purchaseCompany,
            purchasedAmount, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);

        if (!device || !model || !processor || !deviceBrand || !laptopId || !serialNumber || !assetId || !warentyMonths || !purchasedDate || !purchaseCompany || !screenSize || !resolution) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchasedDate, warentyMonths);

        // Query to insert data into LaptopDetails table
        const updatelaptopDetailsQuery = `
            UPDATE LaptopDetails1 SET
                Device = @Device, Model = @Model, DeviceBrand = @DeviceBrand, Processor = @Processor, 
                LaptopId = @LaptopId, InstalledRAM = @InstalledRAM, SerialNumber = @SerialNumber,
                SystemType=@SystemType, InvoiceNumber=@InvoiceNumber, ScreenSize=@ScreenSize, Resolution=@Resolution, PurchaseDate=@PurchaseDate, 
                PurchaseAmount=@PurchaseAmount, PurchaseCompany=@PurchaseCompany,
                WarentyMonths=@WarentyMonths, WarrentyExpieryDate=@WarrentyExpieryDate
                WHERE AssetID=@AssetID`;

        // Query to insert data into DeviceDetails table
        const updatedeviceDetailsQuery = `
            UPDATE DeviceDetails1 SET
                Device=@Device, DeviceBrand=@DeviceBrand, DeviceID=@LaptopId, Model=@Model, 
                SerialNumber=@SerialNumber, SystemType=@SystemType, InvoiceNumber=@InvoiceNumber,
                PurchaseDate=@PurchaseDate, PurchaseAmount=@PurchaseAmount, PurchaseCompany=@PurchaseCompany, WarentyMonths=@WarentyMonths, 
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
                .input('ScreenSize', sql.VarChar(50), screenSize)
                .input('Resolution', sql.VarChar(50), resolution)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('SystemType', sql.VarChar(50), systemType)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchasedDate)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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

        if (!assetId) {
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
                   Processor, InstalledRAM, SystemType, InvoiceNumber, ScreenSize, Resolution, PurchaseDate,
                   PurchaseAmount, PurchaseCompany, WarentyMonths, WarrentyExpieryDate, SysDate
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
app.post('/api/Transfer', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId, device, deviceBrand, model, serialNumber, bitLockerKey, conditionStatus, employeeId, fullName, division, email
        } = req.body;

        console.log('Received form data:', req.body);

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        if (!assetId || !device || !deviceBrand || !model || !serialNumber || !bitLockerKey || !conditionStatus || !employeeId || !fullName || !division || !email) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        try {
            const checkQuery = `
                SELECT COUNT(*) AS count 
                FROM TransferDetails 
                WHERE AssetID = @AssetID AND CurrentStatus = 'In-Use'
            `;
            const checkResult = await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(checkQuery);

            if (checkResult.recordset[0].count > 0) {
                await transaction.rollback();
                return res.status(400).send({ error: 'This asset is already marked as "In-Use" in the Transfer table.' });
            }

            const insertQuery = `
                INSERT INTO TransferDetails 
                (AssetID, Device, DeviceBrand, Model, SerialNumber, BitLockerKey, ConditionStatus, EmployeeID, FullName, Division, Email, IssueDate, CurrentStatus)
                VALUES 
                (@AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @BitLockerKey, @ConditionStatus, @EmployeeID, @FullName, @Division, @Email, GETDATE(), 'In-Use')
            `;
            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .input('Device', sql.VarChar(50), device)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('Model', sql.VarChar(50), model)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('BitLockerKey', sql.VarChar(50), bitLockerKey)
                .input('ConditionStatus', sql.VarChar(50), conditionStatus)
                .input('EmployeeID', sql.VarChar(50), employeeId)
                .input('FullName', sql.VarChar(50), fullName)
                .input('Division', sql.VarChar(50), division)
                .input('Email', sql.VarChar(50), email)
                .query(insertQuery);

            const updateDeviceQuery = `
                UPDATE DeviceDetails1
                SET CurrentStatus = 'In-Use'
                WHERE AssetID = @AssetID  
            `;
            await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceQuery);

            const updateConditionQuery = `
                UPDATE DeviceDetails1
                SET ConditionStatus = 'Good-Condition'
                WHERE AssetID = @AssetID AND ConditionStatus = 'Brand-new'
 
            `;
            const updateConditionResult = await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateConditionQuery);

            const updateTransferDetailsQuery = `
                UPDATE TransferDetails
                SET ConditionStatus = 'Good-Condition'
                WHERE AssetID = @AssetID AND ConditionStatus = 'Brand-new'
 
            `;

            await transaction.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(updateTransferDetailsQuery);

                
            console.log('Updated DeviceDetails table:', updateConditionResult);

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


 

// 

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

        if (!assetId || !device || !deviceBrand || !model || !serialNumber || !conditionStatus || !employeeId || !fullName || !division || !email) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        try {

            // Update TransferDetails Table
          const updateDeviceQuery = `
                UPDATE TransferDetails
                SET CurrentStatus = 'Handover',
                HandoverDate = GETDATE()
                WHERE AssetID = @AssetID and  CurrentStatus = 'In-Use'
            `;

           await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceQuery);

           // Update DeviceDetails Table
          const updateDeviceTableQuery = `
                UPDATE DeviceDetails1
                SET CurrentStatus = 'In-Stock'
                WHERE AssetID = @AssetID
            `;

           await transaction.request()
                .input('AssetID', sql.VarChar(50), assetId)
                .query(updateDeviceTableQuery);

            
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

    console.log('Checking...1');
    
    try {
        const pool = await poolPromise;
        const { assetId, device, deviceBrand, model, serialNumber, repairStatus, repairInvoiceNumber, vendor, 
        issueDate, receivedDate, repairCost } = req.body;
    
        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
    
    console.log('Checking...2');
    
        try {
    
        console.log('Checking...3');
    
               // Check if there's already an 'Issue-Identified' record for this AssetID
                const checkQuery = `
                    SELECT COUNT(*) AS count 
                    FROM IssueTracker
                    WHERE AssetID = @AssetID AND RepairStatus = 'Issue-Identified'
                `;
    
                const checkResult = await transaction.request()
                    .input('AssetID', sql.VarChar(50), assetId)
                    .query(checkQuery);
    
                const inUseCount = checkResult.recordset[0].count;
    
                console.log('Validation Checking');
    
                console.log(inUseCount);
    
                if (inUseCount !== 0) {
                    console.log('Validation : Failed');
                    await transaction.rollback();
                    return res.status(400).send({ error: 'No Issue-Identified' });
                }
    
                console.log('Validation : PASS');
    
            const repairinsertquery = `
            INSERT INTO IssueTracker (
                AssetID, Device, DeviceBrand, Model, SerialNumber, RepairStatus, 
                InvoiceNumber, Vendor, IssueDateToVendor, ReceivedDatefromVendor, RepairCost
            ) VALUES (
                @AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @RepairStatus, 
                @InvoiceNumber, @Vendor, @IssueDateToVendor, @ReceivedDateFromVendor, @RepairCost)
            `;
    
            const repairupdatedevicequery = `
            UPDATE DeviceDetails1
            SET ConditionStatus = @RepairStatus
            WHERE AssetID = @AssetID
            `;
     
    
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
            .query(repairinsertquery);
    
         console.log('Insert to Issue Tracker');
    
            await transaction.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .input('RepairStatus', sql.VarChar(50), repairStatus)
            .query(repairupdatedevicequery);
    
        console.log('Update Condition Status in DeviceDetails');
    
            await transaction.commit();
    
            res.status(201).send({ message: 'Repair data added successfully' });
    
        } catch (error) {
            console.error('Failed to process repair data:', error);
            res.status(500).send({ error: 'Server error: ' + error.message });
        }
        } catch (error) {
            console.error('Error adding transfer:', error.message);
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
            accessoriesType, model, deviceBrand, assetId, deviceId,
            serialNumber, invoiceNumber, purchaseDate, purchaseCompany,
            purchasedAmount, warentyMonths
        } = req.body;
 
        console.log('Received form data:', req.body);
 
        if (!accessoriesType || !deviceBrand || !model || !assetId || !purchaseCompany || !deviceId || !serialNumber || !invoiceNumber || !purchaseDate || !purchasedAmount) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }
 
        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);
 
        const accessoriesDetailsQuery = `
            INSERT INTO Accessories (
                Model, DeviceBrand, AssetID, AssetType, DeviceID, SerialNumber,
                InvoiceNumber, PurchaseDate, PurchaseCompany, PurchaseAmount,
                WarentyMonths, WarrentyExpieryDate, SysDate
            ) VALUES (
                @Model, @DeviceBrand, @AssetID, @AccessoriesType, @DeviceID, @SerialNumber,
                @InvoiceNumber, @PurchaseDate,@PurchaseCompany, @PurchaseAmount,
                @WarentyMonths, @WarrentyExpieryDate, GETDATE()
            )
        `;
 
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                AssetID, Device, DeviceBrand, Model, DeviceID, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseCompany, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, ConditionStatus, SysDate
            ) VALUES (
                @AssetID, @AccessoriesType, @DeviceBrand, @Model, @DeviceID, @SerialNumber, @InvoiceNumber,
                @PurchaseDate, @PurchaseCompany, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', 'Brand-New', GETDATE()
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
                .input('DeviceID', sql.VarChar(50), deviceId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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
                .input('DeviceID', sql.VarChar(50), deviceId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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

//Search
// Route to get laptop details by Asset ID from Accessories table
app.get('/api/accessories/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;
 
        console.log(`Fetching laptop details for Asset ID: ${assetId}`);
 
        const query = `
            SELECT AssetType, DeviceBrand, Model, AssetID, DeviceId, SerialNumber,
                InvoiceNumber, PurchaseDate, PurchaseCompany,
                PurchaseAmount, WarentyMonths
            FROM Accessories
            WHERE AssetID = @AssetID
        `;
 
        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);
 
        if (result.recordset.length > 0) {
            console.log('Accessory details found:', result.recordset[0]);
            res.status(200).json(result.recordset[0]);
        } else {
            console.log('Accessory not found.');
            res.status(404).send({ message: 'Accessory not found' });
        }
    } catch (err) {
        console.error('Error fetching laptop details:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});
 
//Update
app.put('/api/AccessoriesUpdate', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, model, deviceBrand, device, assetId, deviceId,
            serialNumber, invoiceNumber, purchaseDate, purchaseCompany,
            purchasedAmount, warentyMonths
        } = req.body;
 
        console.log('Received form data:', req.body);
 
        if (!accessoriesType || !model || !deviceBrand || !assetId || !deviceId || !serialNumber || !invoiceNumber || !purchaseDate) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }
 
        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);
 
        // Query to insert data into LaptopDetails table
        const updateaccessoriesQuery = `
            UPDATE Accessories SET
                AssetType=@AccessoriesType, Model=@Model, DeviceBrand=@DeviceBrand, AssetID=@AssetID, DeviceId=@DeviceId,
                SerialNumber=@SerialNumber,
                InvoiceNumber=@InvoiceNumber, PurchaseDate=@PurchaseDate, PurchaseCompany=@PurchaseCompany,
                PurchaseAmount=@PurchaseAmount,
                WarentyMonths=@WarentyMonths
                WHERE AssetID=@AssetID`;
 
        // Query to insert data into DeviceDetails table
        const updatedeviceDetailsQuery = `
            UPDATE DeviceDetails1 SET
                Device=@AccessoriesType, Model=@Model, DeviceBrand=@DeviceBrand, AssetID=@AssetID, DeviceId=@DeviceId,
                SerialNumber=@SerialNumber,
                InvoiceNumber=@InvoiceNumber, PurchaseDate=@PurchaseDate, PurchaseCompany=@PurchaseCompany,
                PurchaseAmount=@PurchaseAmount,
                WarentyMonths=@WarentyMonths
                WHERE AssetID=@AssetID`;
 
        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
 
        try {
            // Insert into LaptopDetails
            await transaction.request()
                .input('AccessoriesType', sql.VarChar(50), accessoriesType)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('DeviceId', sql.VarChar(50), deviceId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .input('WarrentyExpieryDate', sql.Date, warrentyExpieryDate)
                .query(updateaccessoriesQuery);
 
            console.log('Updated into Laptop Details table');
 
            // Insert into DeviceDetails
            await transaction.request()
            // .input('Device', sql.VarChar(50), device)
            .input('AccessoriesType', sql.VarChar(50), accessoriesType)
            .input('Model', sql.VarChar(50), model)
            .input('DeviceBrand', sql.VarChar(50), deviceBrand)
            .input('AssetID', sql.VarChar(50), assetId)
            .input('DeviceId', sql.VarChar(50), deviceId)
            .input('SerialNumber', sql.VarChar(50), serialNumber)
            .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
            .input('PurchaseDate', sql.Date, purchaseDate)
            .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
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
 
 
//Delete
app.post('/api/AccessoriesDelete', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId,model
        } = req.body;
 
        console.log('Received form data:', req.body);
 
        // if (!model || !assetId) {
        //     return res.status(400).send({ error: 'All required fields must be provided' });
        // }
 
        // Query to insert data into LaptopDetails table
        const deleteaccessoriesDetailsQuery = `
            DELETE FROM Accessories WHERE AssetID=@AssetID`;
 
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
                .query(deleteaccessoriesDetailsQuery);
 
            console.log('Deleted Accessories table');
 
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


 
// networkEquipment
app.post('/api/networkEquipment', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, model, deviceBrand, assetId, macID, deviceId,
            serialNumber, invoiceNumber, purchaseCompany, purchaseDate,
            purchasedAmount, warentyMonths
        } = req.body;
 
        console.log('Received form data:', req.body);
 
 
 
        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);
 
        const networkEquipmentsQuery = `
            INSERT INTO NetworkEquipments (
                Model, DeviceBrand, AssetType, AssetID, MACAddress, DeviceID, SerialNumber,
                InvoiceNumber, PurchaseCompany, PurchaseDate, PurchaseAmount,
                WarentyMonths, SysDate
            ) VALUES (
                @Model, @DeviceBrand, @AccessoriesType, @AssetID, @MACAddress,
                @DeviceID, @SerialNumber,
                @InvoiceNumber, @PurchaseCompany, @PurchaseDate, @PurchaseAmount,
                @WarentyMonths, GETDATE()
            )
        `;
 
        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                AssetID, Device,DeviceBrand, DeviceID, Model, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, ConditionStatus, SysDate
            ) VALUES (
                @AssetID, @AccessoriesType, @DeviceBrand, @DeviceID, @Model, @SerialNumber, @InvoiceNumber,
                @PurchaseDate, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', 'Good-Condition', GETDATE()
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
                .input('PurchaseCompany',sql.VarChar(50), purchaseCompany)
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
 
//Search
// Route to get Network Equipments details by Asset ID from Networks table
app.get('/api/networkEquipmentSearch/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;
 
        console.log(`Fetching network equipments details for Asset ID: ${assetId}`);
 
        const query = `
            SELECT AssetType, DeviceBrand, Model, AssetID, MACAddress, DeviceID, SerialNumber,
                InvoiceNumber, PurchaseDate, PurchaseCompany,
                PurchaseAmount, WarentyMonths
            FROM NetworkEquipments
            WHERE AssetID = @AssetID
        `;
 
        const result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(query);
 
        if (result.recordset.length > 0) {
            console.log('Network equipment details found:', result.recordset[0]);
            res.status(200).json(result.recordset[0]);
        } else {
            console.log('Network equipment not found.');
            res.status(404).send({ message: 'Network equipment not found' });
        }
    } catch (err) {
        console.error('Error fetching network equipment details:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});
 
 
//Update
app.put('/api/NetworkEquipmentsUpdate', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, deviceBrand, model, assetId, macID, deviceId,
            serialNumber, invoiceNumber, purchaseDate, purchaseCompany,
            purchasedAmount, warentyMonths // This should be "warrantyMonths"
        } = req.body;
 
        console.log('Received form data:', req.body);
 
        if (!accessoriesType || !deviceBrand || !model || !assetId || !macID || !deviceId || !serialNumber || !invoiceNumber || !purchaseDate) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }
 
        
        // Corrected SQL Query: Updated field names and added missing fields
        const updatedNetworkEquipmentQuery = `
            UPDATE NetworkEquipments SET
                AssetType = @AccessoriesType, DeviceBrand = @DeviceBrand, Model = @Model, AssetID = @AssetID, MACAddress = @MACAddress,
                DeviceID = @DeviceId, SerialNumber = @SerialNumber,  
                InvoiceNumber = @InvoiceNumber, PurchaseDate = @PurchaseDate, PurchaseCompany = @PurchaseCompany,
                PurchaseAmount = @PurchaseAmount, WarentyMonths = @WarentyMonths
                WHERE AssetID = @AssetID`;
 
        const updatedeviceDetailsQuery = `
            UPDATE DeviceDetails1 SET
                Device = @AccessoriesType, Model = @Model, DeviceBrand = @DeviceBrand, AssetID = @AssetID,
                SerialNumber = @SerialNumber, InvoiceNumber = @InvoiceNumber, PurchaseDate = @PurchaseDate, PurchaseCompany = @PurchaseCompany,
                PurchaseAmount = @PurchaseAmount, WarentyMonths = @WarentyMonths
                WHERE AssetID = @AssetID`;
 
        // Execute the queries within a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
 
        try {
            // Update into NetworkEquipments
            await transaction.request()
                .input('AccessoriesType', sql.VarChar(50), accessoriesType)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('Model', sql.VarChar(50), model)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('MACAddress', sql.VarChar(50), macID) // Corrected input name
                .input('DeviceID', sql.VarChar(50), deviceId)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .query(updatedNetworkEquipmentQuery);
 
            console.log('Updated into Network Equipments table');
 
            // Update into DeviceDetails1
            await transaction.request()
                .input('AccessoriesType', sql.VarChar(50), accessoriesType)
                .input('Model', sql.VarChar(50), model)
                .input('DeviceBrand', sql.VarChar(50), deviceBrand)
                .input('AssetID', sql.VarChar(50), assetId)
                .input('SerialNumber', sql.VarChar(50), serialNumber)
                .input('InvoiceNumber', sql.VarChar(50), invoiceNumber)
                .input('PurchaseDate', sql.Date, purchaseDate)
                .input('PurchaseCompany', sql.VarChar(50), purchaseCompany)
                .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
                .input('WarentyMonths', sql.Int, warentyMonths)
                .query(updatedeviceDetailsQuery);
 
            console.log('Updated into Device Details table');
 
            await transaction.commit();
 
            res.status(201).send({ message: 'Updated Device successfully in both tables' });
        } catch (error) {
            console.error('Error during transaction, rolling back:', error.message);
            await transaction.rollback();
            res.status(500).send({ error: 'Error updating data: ' + error.message });
        }
    } catch (err) {
        console.error('Error establishing connection or starting transaction:', err.message);
        res.status(500).send({ error: 'Server error: ' + err.message });
    }
});
 
//Delete
app.post('/api/NetworkEquipmentDelete', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId,model
        } = req.body;
 
        console.log('Received form data:', req.body);
 
       
 
        // Query to insert data into LaptopDetails table
        const deleteaccessoriesDetailsQuery = `
            DELETE FROM NetworkEquipments WHERE AssetID=@AssetID`;
 
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
                .query(deleteaccessoriesDetailsQuery);
 
            console.log('Deleted Network Equipment table');
 
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

app.get('/api/devicesR/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;
        console.log(`Fetching device details for Asset ID: ${assetId}`);

        // Query to check if asset ID exists in the Repair table
        const repairQuery = `
            SELECT Device, DeviceBrand, Model, SerialNumber, RepairStatus, InvoiceNumber,
            Vendor, IssueDateToVendor, ReceivedDatefromVendor, RepairCost, RepairNote
            FROM IssueTracker
            WHERE AssetID = @AssetID AND RepairStatus NOT IN ('Resolved')
        `;

        // Query to check if asset ID exists in the DeviceDetails1 table
        const deviceQuery = `
            SELECT Device, DeviceBrand, Model, SerialNumber
            FROM DeviceDetails1
            WHERE AssetID = @AssetID
        `;

        console.log(`ConditionStatus updated to 'Good' for Asset ID: ${assetId}`);

        // First, check the Repair table
        let result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(repairQuery);

        if (result.recordset.length > 0) {
            const data = result.recordset[0];
            // Convert date fields to string format for consistent frontend handling
            data.IssueDateToVendor = data.IssueDateToVendor ? data.IssueDateToVendor.toISOString().split('T')[0] : null;
            data.ReceivedDatefromVendor = data.ReceivedDatefromVendor ? data.ReceivedDatefromVendor.toISOString().split('T')[0] : null;
            
            console.log('Device found in Repair table:', data);
            return res.json(data);
        }



        // If not found in Repair table, check the DeviceDetails1 table
        result = await pool.request()
            .input('AssetID', sql.VarChar(50), assetId)
            .query(deviceQuery);

        if (result.recordset.length > 0) {
            console.log('Device found in DeviceDetails1 table:', result.recordset);
            return res.json(result.recordset[0]);
        }

        // If not found in either table
        res.status(404).send('Device not found');
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});




app.put('/api/repair/update', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            assetId,
            repairStatus, 
            repairInvoiceNumber, 
            vendor, 
            issueDate, 
            receivedDate, 
            repairCost,
            repairNote
        } = req.body;

        console.log('Received form data:', req.body);

        const IssueTrackerUpdateQuery = `
            UPDATE IssueTracker
            SET RepairStatus = @RepairStatus, 
                InvoiceNumber = @InvoiceNumber, 
                Vendor = @Vendor, 
                IssueDateToVendor = @IssueDateToVendor, 
                ReceivedDatefromVendor = @ReceivedDatefromVendor, 
                RepairCost = @RepairCost,
                RepairNote = @RepairNote
            WHERE AssetID = @AssetID AND RepairStatus NOT IN ('Resolved');
        `;

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const request = transaction.request();
            request.input('RepairStatus', sql.VarChar(50), repairStatus)
                   .input('InvoiceNumber', sql.VarChar(50), repairInvoiceNumber)
                   .input('Vendor', sql.VarChar(50), vendor)
                   .input('IssueDateToVendor', sql.Date, issueDate)  
                   .input('ReceivedDatefromVendor', sql.Date, receivedDate)
                   .input('RepairCost', sql.Decimal(10, 2), repairCost)  
                   .input('RepairNote', sql.VarChar(500), repairNote) 
                   .input('AssetID', sql.VarChar(50), assetId);  

        // If the repair status is "Resolved", update the DeviceDetails1 table
        if (repairStatus === "Issue-Identified") {
            const issueQuery = `
                UPDATE DeviceDetails1
                SET ConditionStatus = 'Issue-Identified'
                WHERE AssetID = @AssetID;`

                await request.query(issueQuery);
                console.log('ConditionStatus updated to Issue-Identified for Asset ID:', assetId);    
         }else if(repairStatus === "Send-to-Repair"){
                const issueSendQuery = `
                UPDATE DeviceDetails1
                SET ConditionStatus = 'Send-to-Repair'
                WHERE AssetID = @AssetID;`

                await request.query(issueSendQuery);
                console.log('ConditionStatus updated to Send-to-Repair for Asset ID:', assetId);   
            }
        else  {
            const updateDevice1Query = `
                UPDATE DeviceDetails1
                SET ConditionStatus = 'Good-Condition'
                WHERE AssetID = @AssetID;`
            await request.query(updateDevice1Query);
            console.log('ConditionStatus updated to Good for Asset ID:', assetId);
        }

            await request.query(IssueTrackerUpdateQuery);
            console.log('Updated into Issue Tracker table successfully');
            await transaction.commit();
            res.status(201).send({ message: 'Updated Issue successfully' });
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



app.get('/api/Inventory', async (req, res) => {
    try {
        const pool = await poolPromise;
        
        console.log(`Fetching inventory details`);
        
        const invquery = `
            SELECT device
            ,TotalDeviceCount
            ,InstockCount
            ,InUseCount
            ,InstockGoodCount
            ,InstockFairCount
            ,InUseGoodCount
            ,InUseFairCount
            FROM InventorySummary
        `;

        const result = await pool.request()
            .query(invquery);

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


app.get('/api/EmployeeChart', async (req, res) => {
    try {
        const pool = await poolPromise;
        
        console.log(`Fetching employee details`);
        
        const invquery = `
            SELECT EmployeeID
            ,FullName
            ,Division
            ,Email
            FROM Employees
        `;

        const result = await pool.request()
            .query(invquery);

        console.log('Query executed successfully. Result:', result.recordset);

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});