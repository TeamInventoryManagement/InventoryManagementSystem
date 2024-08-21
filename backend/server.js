const express = require('express');
const cors = require('cors');
const app = express();
const { sql, poolPromise } = require('./db');

// Use CORS middleware
app.use(cors());
app.use(express.json());

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

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
