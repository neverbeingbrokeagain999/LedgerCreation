const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority&appName=Test1";
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  return client.db('ledgermaster').collection('ledger_entries');
}

module.exports = async (req, res) => {
  const { id } = req.query;
  
  try {
    const collection = await connectDB();
    
    switch (req.method) {
      case 'GET':
        const entry = await collection.findOne({ _id: new ObjectId(id) });
        if (!entry) {
          return res.status(404).json({ error: 'Ledger entry not found' });
        }
        res.json(entry);
        break;
        
      case 'PUT':
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Ledger entry not found' });
        }
        res.json({ success: true });
        break;
        
      case 'DELETE':
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Ledger entry not found' });
        }
        res.json({ success: true });
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
