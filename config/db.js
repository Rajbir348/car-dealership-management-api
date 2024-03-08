import mongodb from 'mongodb';

const { MongoClient } = mongodb;
let db;

export const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('MongoDB connected');
    
    db = client.db(); // Assign the connected database instance to the global variable
    return db; // Return the connected database instance
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export { db }; 
