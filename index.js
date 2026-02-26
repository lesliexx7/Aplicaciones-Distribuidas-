require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

async function listDatabases(client) {
   const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main() {
const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
