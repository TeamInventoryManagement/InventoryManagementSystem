const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('./db'); 
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());



// Function to calculate warranty expiry date
function calculateWarrantyExpiryDate(purchaseDate, warentyMonths) {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + parseInt(warentyMonths, 10));
    return date.toISOString().split('T')[0]; 
}


// Login route
// app.post('api/login', (req, res) => {
//     const { email, password } = req.body;
//     const sql = 'SELECT * FROM UserDetails WHERE Email = ?';
//     db.query(sql, [email], (err, results) => {
//       if (err) throw err;
//       if (results.length > 0) {
//         const user = results[0];
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) throw err;
//           if (isMatch) {
//             res.json({ success: true });
//           } else {
//             res.json({ success: false });
//           }
//         });
//       } else {
//         res.json({ success: false });
//       }
//     });
//   });

// Inserts laptop details into both LaptopDetails table and DeviceDetails table
app.post('/api/LaptopDetails', async (req, res) => {
    try {
        const pool = await poolPromise;
        const {
            device, model, deviceBrand, assetId, processor, laptopId, installedRam,
            serialNumber, systemType, invoiceNumber, purchasedCompnay, purchaseDate,
            purchasedAmount, address, warentyMonths
        } = req.body;

        console.log('Received form data:', req.body);

        if (!device || !model || !deviceBrand || !laptopId || !serialNumber || !assetId || !warentyMonths || !purchaseDate) {
            return res.status(400).send({ error: 'All required fields must be provided' });
        }

        // Calculate the warranty expiry date
        const warrentyExpieryDate = calculateWarrantyExpiryDate(purchaseDate, warentyMonths);

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

        const deviceDetailsQuery = `
            INSERT INTO DeviceDetails1 (
                Device, AssetID, DeviceBrand, DeviceID, Model, SerialNumber, SystemType, InvoiceNumber, PurchasedCompnay
                PurchaseDate, PurchaseAmount, WarentyMonths, WarrentyExpieryDate, CurrentStatus, SysDate
            ) VALUES (
                @Device, @AssetID, @DeviceBrand, @LaptopId, @Model, @SerialNumber, @SystemType, @InvoiceNumber, @purchasedCompnay,
                @PurchaseDate, @PurchaseAmount, @WarentyMonths, @WarrentyExpieryDate, 'In-Stock', GETDATE()
            )
        `;

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
                .input('PurchaseDate', sql.Date, purchaseDate)
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
                .input('PurchasedCompnay', sql.VarChar(50), purchasedCompnay)
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


//Insert Transfer details to the transferDetails table
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

//Update In-Use current status throught handover button
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
            accessoriesType, model, deviceBrand, assetId,
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
                .input('AccessoryType', sql.VarChar(255), req.body.accessoryType)
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



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});