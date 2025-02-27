const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow all origins
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority&appName=Test1";
const client = new MongoClient(uri);

let db;
let collection;

// Connect to MongoDB
async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db('ledgermaster');
      collection = db.collection('ledger_entries');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  return { db, collection };
}

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    await connectDB();
    res.json({ message: 'API is working!', status: 'connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new ledger entry
app.post('/api/ledger', async (req, res) => {
  try {
    const { collection } = await connectDB();
    const entry = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await collection.insertOne(entry);
    res.json({ id: result.insertedId });
  } catch (error) {
    console.error('Error creating ledger:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all ledger entries
app.get('/api/ledger', async (req, res) => {
  try {
    const { collection } = await connectDB();
    const entries = await collection.find().toArray();
    res.json(entries);
  } catch (error) {
    console.error('Error getting ledgers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a ledger entry by ID
app.get('/api/ledger/:id', async (req, res) => {
  try {
    const { collection } = await connectDB();
    const entry = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.json(entry);
  } catch (error) {
    console.error('Error getting ledger:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a ledger entry
app.put('/api/ledger/:id', async (req, res) => {
  try {
    const { collection } = await connectDB();
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating ledger:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a ledger entry
app.delete('/api/ledger/:id', async (req, res) => {
  try {
    const { collection } = await connectDB();
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting ledger:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear all ledger entries
app.delete('/api/ledger', async (req, res) => {
  try {
    const { collection } = await connectDB();
    await collection.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing ledgers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle root route
app.get('/', (req, res) => {
  res.json({ message: 'Ledger Master API is running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Export the Express API
module.exports = app;
