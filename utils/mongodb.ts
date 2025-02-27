import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://666hemanth:666hemanth@test1.pcc7w.mongodb.net/?retryWrites=true&w=majority&appName=Test1";
const client = new MongoClient(uri);

export const connectToMongo = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('ledgermaster');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getCollection = async (collectionName: string) => {
  const db = await connectToMongo();
  return db.collection(collectionName);
};
