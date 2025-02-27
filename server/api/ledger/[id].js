const { MongoClient, ObjectId } = require('mongodb');

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
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'ID parameter is required'
    });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('ledger_entries');
    
    switch (req.method) {
      case 'GET':
        const entry = await collection.findOne({ _id: new ObjectId(id) });
        if (!entry) {
          return res.status(404).json({
            status: 'error',
            message: 'Ledger entry not found'
          });
        }
        res.status(200).json({
          status: 'success',
          data: entry
        });
        break;
        
      case 'PUT':
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...req.body, updatedAt: new Date().toISOString() } }
        );
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Ledger entry not found'
          });
        }
        res.status(200).json({
          status: 'success',
          message: 'Entry updated successfully'
        });
        break;
        
      case 'DELETE':
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Ledger entry not found'
          });
        }
        res.status(200).json({
          status: 'success',
          message: 'Entry deleted successfully'
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
