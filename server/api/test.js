const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority&appName=Test1";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    await client.connect();
    res.json({ message: 'API is working!', status: 'connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
