const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Attempting native connection to:", uri);
    await client.connect();
    console.log("✅ Connected successfully to Atlas with native driver!");
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (e) {
    console.error("❌ Native Connection Error:", e);
  } finally {
    await client.close();
  }
}
run();
