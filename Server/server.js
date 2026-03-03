require('dotenv').config();
const { MongoClient } = require('mongodb');

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("\n Databases:");
  databasesList.databases.forEach(db => {
    console.log(" - " + db.name);
  });
}

async function findAllData(client) {

  // ===============================
  //  COLECCIÓN: comments
  // ===============================
  console.log("\n Consultando colección: comments");

  const comments = await client
    .db("sample_mflix")
    .collection("comments")
    .find({})
    .limit(5)
    .toArray();

  console.log("Cantidad de comentarios:", comments.length);

  if (comments.length > 0) {
    console.log("Primer Name:", comments[0].name);
  }

  console.log("Comentarios encontrados:");
  console.log(JSON.stringify(comments, null, 2));


  // ===============================
  //  COLECCIÓN: embedded_movies
  // ===============================
  console.log("\n Consultando colección: embedded_movies");

  const movies = await client
    .db("sample_mflix")
    .collection("embedded_movies")
    .find({})
    .limit(5) 
    .toArray();

  console.log("Cantidad de películas:", movies.length);

  if (movies.length > 0) {
    console.log("Primer Title:", movies[0].title);
  }

  console.log("Películas encontradas:");
  console.log(JSON.stringify(movies, null, 2));
}

async function main() {

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    console.log(" Conectando...");
    await client.connect();
    console.log(" Conectado correctamente");

    await listDatabases(client);
    await findAllData(client);

  } catch (e) {
    console.error(" Error:", e);
  } finally {
    await client.close();
    console.log("\n Conexión cerrada");
  }
}

main().catch(console.error);