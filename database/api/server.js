import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// Conexion a MongoDB
const MONGO_URI = "mongodb://mongo:27017";
const DB_NAME = "applemusic";

let db, songs, artists, streams;

async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db(DB_NAME);

    songs = db.collection("songs");
    artists = db.collection("artists");
    streams = db.collection("streams");

    console.log("API conectada a MongoDB");
  } catch (err) {
    console.error("Error al conectar Mongo:", err);
  }
}

connectDB();

// -----------------------------
// RUTAS API
// -----------------------------

app.get("/api/top-songs", async (req, res) => {
  try {
    const data = await songs.find({}).sort({ streams: -1 }).limit(10).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo top songs" });
  }
});

app.get("/api/top-artists", async (req, res) => {
  try {
    const data = await artists.find({}).sort({ popularity: -1 }).limit(10).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo top artists" });
  }
});

app.get("/api/top-genres", async (req, res) => {
  try {
    const data = await songs.aggregate([
      { $group: { _id: "$genre", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]).toArray();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error en top genres" });
  }
});

app.get("/api/streams/count", async (req, res) => {
  try {
    const total = await streams.countDocuments();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ error: "Error en streams count" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("API lista en http://localhost:3000");
});
