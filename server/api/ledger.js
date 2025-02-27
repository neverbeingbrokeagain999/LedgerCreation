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
    const collection = db.collection('ledger_entries');
    
    switch (req.method) {
      case 'GET':
        const entries = await collection.find().toArray();
        res.status(200).json({
          status: 'success',
          data: entries
        });
        break;
        
      case 'POST':
        const entry = {
          ...req.body,
          createdAt: new Date().toISOString()
        };
        const result = await collection.insertOne(entry);
        res.status(201).json({
          status: 'success',
          data: { id: result.insertedId }
        });
        break;
        
      case 'DELETE':
        await collection.deleteMany({});
        res.status(200).json({
          status: 'success',
          message: 'All entries deleted'
        });
        break;
        
      default:
        res.status(405).json({
          status: 'error',
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
