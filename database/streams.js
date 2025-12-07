use("applemusic");

// STREAMS (histórico de reproducciones)
db.streams.insertMany([
  // Bad Bunny (a1)
  {
    _id: "st1",
    userId: "u1",
    songId: "s1",
    artistId: "a1",
    albumId: "al1",
    duration: 210,
    country: "GT",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // hace 5 días
  },
  {
    _id: "st2",
    userId: "u1",
    songId: "s2",
    artistId: "a1",
    albumId: "al1",
    duration: 180,
    country: "GT",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // hace 2 días
  },

  // Taylor Swift (a2)
  {
    _id: "st3",
    userId: "u2",
    songId: "s3",
    artistId: "a2",
    albumId: "al2",
    duration: 200,
    country: "GT",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },

  // Extra streams para agregaciones
  {
    _id: "st4",
    userId: "u2",
    songId: "s1",
    artistId: "a1",
    albumId: "al1",
    duration: 210,
    country: "GT",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "st5",
    userId: "u1",
    songId: "s3",
    artistId: "a2",
    albumId: "al2",
    duration: 200,
    country: "US",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

print("✔ Streams insertados correctamente");
