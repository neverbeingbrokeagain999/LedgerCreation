const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI || "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority");
  const db = client.db('ledgermaster');
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();
    res.status(200).json({ 
      status: 'success',
      message: 'Server is running and connected to MongoDB',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message 
    });
  }
};
