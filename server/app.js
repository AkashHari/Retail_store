const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { BlobServiceClient } = require("@azure/storage-blob");
const upload = multer({ storage: multer.memoryStorage() });
const PriceRecordSchema = require("./model/schema");

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/pricing');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    setRoutes(app);
    //
    app.listen(app.get('port'), () => {
        console.log('Angular Full Stack listening on port ' + app.get('port'));
    });

});

// Upload CSV
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "uploads";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = Date.now() + "-" + req.file.originalname;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer);

    res.send("Upload successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});


// Search API
app.get('/prices', async (req, res) => {
    try {
        const data = await PriceRecordSchema.find(req.query);
        res.send(data);
    } catch (err) {
        res.status(500).send("Not able to find");
    }
  
});

// Update API
app.put('/prices/:id', async (req, res) => {
    const updated = await PriceRecordSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
});

app.listen(3000, () => console.log('Server started on port 3000'));
