import { MongoClient } from "mongodb";

// CONEXIÓN SIN AUTENTICACIÓN (MODO EXAMEN)
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function run() {
  try {
    await client.connect();
    console.log("🚀 Conectado a MongoDB");

    const db = client.db("applemusic");

    // Limpiar colecciones
    await db.collection("users").deleteMany({});
    await db.collection("artists").deleteMany({});
    await db.collection("songs").deleteMany({});
    await db.collection("streams").deleteMany({});

    console.log("🧹 Colecciones limpiadas");

    // Usuarios (50)
    const users = [];
    for (let i = 1; i <= 50; i++) {
      users.push({
        _id: "u" + i,
        name: "User " + i,
        country: ["GT", "US", "MX"][i % 3]
      });
    }

    // Artistas (5)
    const artists = [];
    for (let i = 1; i <= 5; i++) {
      artists.push({
        _id: "a" + i,
        name: "Artist " + i
      });
    }

    // Canciones (100)
    const songs = [];
    for (let i = 1; i <= 100; i++) {
      songs.push({
        _id: "s" + i,
        title: "Song " + i,
        artist_id: "a" + ((i % 5) + 1),
        duration: Math.floor(Math.random() * 200) + 60
      });
    }

    // Streams (2000)
    const streams = [];
    const now = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    for (let i = 1; i <= 2000; i++) {
      streams.push({
        _id: "st" + i,
        user_id: "u" + ((i % 50) + 1),
        song_id: "s" + ((i % 100) + 1),
        artist_id: "a" + ((i % 5) + 1),
        seconds_played: Math.floor(Math.random() * 200),
        played_at: randomDate(twoMonthsAgo, now),
        device: ["iPhone", "Android", "Windows"][i % 3],
        region: ["GT", "MX", "US"][i % 3],
        session_id: "sess" + i,
        completed: Math.random() > 0.5
      });
    }

    // Insertar
    await db.collection("users").insertMany(users);
    await db.collection("artists").insertMany(artists);
    await db.collection("songs").insertMany(songs);
    await db.collection("streams").insertMany(streams);

    console.log("🎉 Datos insertados con éxito.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
