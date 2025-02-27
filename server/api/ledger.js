const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority&appName=Test1";
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  return client.db('ledgermaster').collection('ledger_entries');
}

module.exports = async (req, res) => {
  try {
    const collection = await connectDB();
    
    switch (req.method) {
      case 'GET':
        const entries = await collection.find().toArray();
        res.json(entries);
        break;
        
      case 'POST':
        const entry = {
          ...req.body,
          createdAt: new Date().toISOString()
        };
        const result = await collection.insertOne(entry);
        res.json({ id: result.insertedId });
        break;
        
      case 'DELETE':
        await collection.deleteMany({});
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
