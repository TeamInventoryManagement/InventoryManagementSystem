const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('./db'); 
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.sendStatus(401); // No token provided

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token verification failed', err);
            return res.sendStatus(403); // Invalid token
        }
        req.user = user;
        console.log('User authenticated', req.user); // Logging the authenticated user
        next();
    });
}



function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
}


// Function to calculate warranty expiry date
function calculateWarrantyExpiryDate(purchaseDate, warentyMonths) {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + parseInt(warentyMonths, 10));
    return date.toISOString().split('T')[0]; 
}


const jwtSecretKey = process.env.JWT_SECRET || 'inventory123'; 
const tokenExpiration = '3m'; 

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
                const token = jwt.sign({
                    id: user.ID,
                    role: user.UserRole
                }, jwtSecretKey, { expiresIn: '1h' });
 
                res.json({ message: 'Successfully logged in', token });
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

// Authentication Middleware
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token not provided');
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
}



// Authorization Middleware
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role.toLowerCase();
        const allowedRolesLowercase = allowedRoles.map(role => role.toLowerCase());
        if (!allowedRolesLowercase.includes(userRole)) {
            return res.status(403).send('Role not permitted');
        }
        next();
    };
}

  
  


// Inserts laptop details into both LaptopDetails table and DeviceDetails table
app.post('/api/LaptopDetails', async (req, res) => {
    const {
        device, model, deviceBrand, assetId, processor, laptopId, installedRam,
        serialNumber, systemType, invoiceNumber, purchasedCompany, purchaseDate,
        purchasedAmount, address, warrantyMonths
    } = req.body;

    console.log('Received form data:', req.body);

    if (!device || !model || !deviceBrand || !assetId || !processor || !laptopId ||
        !installedRam || !serialNumber || !systemType || !invoiceNumber ||
        !purchasedCompany || !purchaseDate || !purchasedAmount || !address || !warrantyMonths) {
        return res.status(400).send({ error: 'All required fields must be provided' });
    }

    const warrantyExpiryDate = calculateWarrantyExpiryDate(purchaseDate, warrantyMonths);

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        const laptopDetailsQuery = `
            INSERT INTO LaptopDetails1 (
                Device, Model, DeviceBrand, AssetID, Processor, LaptopId, InstalledRAM, SerialNumber,
                SystemType, InvoiceNumber, PurchaseDate, PurchaseAmount, Address,
                WarrantyMonths, WarrantyExpiryDate, SysDate
            ) VALUES (
                @Device, @Model, @DeviceBrand, @AssetID, @Processor, @LaptopId, @InstalledRAM, @SerialNumber,
                @SystemType, @InvoiceNumber, @PurchaseDate, @PurchaseAmount, @Address,
                @WarrantyMonths, @WarrantyExpiryDate, GETDATE()
            );
        `;

        const request = new sql.Request(transaction);
        request.input('Device', sql.VarChar, device)
               .input('Model', sql.VarChar, model)
               .input('DeviceBrand', sql.VarChar, deviceBrand)
               .input('AssetID', sql.VarChar, assetId)
               .input('Processor', sql.VarChar, processor)
               .input('LaptopId', sql.VarChar, laptopId)
               .input('InstalledRAM', sql.VarChar, installedRam)
               .input('SerialNumber', sql.VarChar, serialNumber)
               .input('SystemType', sql.VarChar, systemType)
               .input('InvoiceNumber', sql.VarChar, invoiceNumber)
               .input('PurchaseDate', sql.Date, new Date(purchaseDate))
               .input('PurchaseAmount', sql.Decimal(10, 2), purchasedAmount)
               .input('Address', sql.VarChar, address)
               .input('WarrantyMonths', sql.Int, warrantyMonths)
               .input('WarrantyExpiryDate', sql.Date, new Date(warrantyExpiryDate));

        await request.query(laptopDetailsQuery);
        console.log('Inserted into LaptopDetails1 table');

        await transaction.commit();
        res.status(201).send({ message: 'Laptop details added successfully.' });
    } catch (err) {
        console.error('Error during transaction, rolling back:', err.message);
        if (transaction) await transaction.rollback();
        res.status(500).send({ error: 'Failed to insert laptop details: ' + err.message });
    }
});



// Retrieve laptop details by Asset ID from LaptopDetails1 table
app.get('/api/laptop/:assetId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const assetId = req.params.assetId;

        console.log(`Fetching laptop details for Asset ID: ${assetId}`);

        const query = `
            SELECT Device, AssetID, DeviceBrand, LaptopId, Model, SerialNumber,
                   Processor, InstalledRAM, SystemType, InvoiceNumber, PurchasedCompnay, PurchaseDate,
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


//Retrievedevice details from device table to the transfer page  /Tranfer page
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


//Insert Employee details to the employee details table /employee page
app.post('/api/employees', authenticateToken, requireRole('SuperAdmin'), async (req, res) => {
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
        console.error('Error fetching employee details:', err.message);
        res.status(500).send('Server error');
    }
});


//Retrieve device details from deviceDetails1 table to the transfer form
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


app.post('/api/transfer', authenticateToken, authorizeRole(1), async (req, res) => {
    const { assetId, device, deviceBrand, model, serialNumber, conditionStatus, newLocation, transferDate } = req.body;

    // Validate the input data
    if (!assetId || !device || !deviceBrand || !model || !serialNumber || !conditionStatus || !newLocation || !transferDate) {
        return res.status(400).send({ error: 'All fields must be provided and valid.' });
    }

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        const transferQuery = `
            INSERT INTO TransferDetails (AssetID, Device, DeviceBrand, Model, SerialNumber, ConditionStatus, NewLocation, TransferDate)
            VALUES (@AssetID, @Device, @DeviceBrand, @Model, @SerialNumber, @ConditionStatus, @NewLocation, @TransferDate);
        `;

        const request = new sql.Request(transaction);
        request.input('AssetID', sql.VarChar, assetId);
        request.input('Device', sql.VarChar, device);
        request.input('DeviceBrand', sql.VarChar, deviceBrand);
        request.input('Model', sql.VarChar, model);
        request.input('SerialNumber', sql.VarChar, serialNumber);
        request.input('ConditionStatus', sql.VarChar, conditionStatus);
        request.input('NewLocation', sql.VarChar, newLocation);
        request.input('TransferDate', sql.Date, new Date(transferDate));

        await request.query(transferQuery);

        // Assuming you might want to update the current status or location of the device in another table
        const updateDeviceStatusQuery = `
            UPDATE DeviceDetails
            SET CurrentStatus = 'Transferred', Location = @NewLocation
            WHERE AssetID = @AssetID;
        `;

        request.query(updateDeviceStatusQuery);

        await transaction.commit();
        res.status(201).send({ message: 'Transfer data successfully inserted and device status updated.' });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Failed to insert transfer data:', error);
        res.status(500).send({ error: 'Failed to process transfer data: ' + error.message });
    }
});



//Insert IssueTracker form data to the IssueTracker table
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


// accessories
app.post('/api/accessories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            accessoriesType, device, model, deviceBrand, assetId,
            serialNumber, invoiceNumber, purchaseDate,
            purchasedAmount, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);



        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);

        const accessoriesDetailsQuery = `
            INSERT INTO Accessories (
                Model, DeviceBrand, AssetID, AccessoriesType, SerialNumber,
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
                AssetID, DeviceBrand, Device, Model, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @AssetID, @DeviceBrand, @AccessoriesType, @Model, @SerialNumber, @InvoiceNumber,
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
                .input('Device', sql.VarChar(255), device)
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
            accessoriesType, model, deviceBrand, assetId, macID, ipAddress,
            serialNumber, invoiceNumber, purchasedCompnay, purchaseDate,
            purchasedAmount, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);



        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);

        const networkEquipmentsQuery = `
            INSERT INTO NetworkEquipments (
                Model, DeviceBrand, AccessoriesType, AssetID, MACAddress, IPAddress, SerialNumber,
                InvoiceNumber, PurchasedCompnay, PurchaseDate, PurchaseAmount,
                WarentyMonths, SysDate
            ) VALUES (
                @Model, @DeviceBrand, @AccessoriesType, @AssetID, @MACAddress,
                @IPAddress, @SerialNumber,
                @InvoiceNumber, @PurchasedCompnay, @PurchaseDate, @PurchaseAmount,
                @WarentyMonths, GETDATE()
            )
        `;

        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                AssetID, DeviceBrand, Model, SerialNumber, InvoiceNumber,
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @AssetID, @DeviceBrand, @Model, @SerialNumber, @InvoiceNumber,
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
                .input('IPAddress', sql.VarChar(50), ipAddress)
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
                .input('AssetID', sql.VarChar(50), assetId)
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



//Chart.js
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