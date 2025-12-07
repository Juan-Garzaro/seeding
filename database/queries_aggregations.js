// ==============================================
// queries_aggregations.js  (100% compatible)
// ==============================================

// Ejecutar con:  load('/queries_aggregations.js')

const MS_IN_DAY = 86400000;
const now = new Date();
const daysAgo = d => new Date(now.getTime() - d * MS_IN_DAY);


// ==============================================
// 1) ROYALTIES POR ARTISTA (últimos 30 días)
// ==============================================
print("=== 1) Royalties: total_seconds por artista (últimos 30 días) ===");

{
  const start = daysAgo(30);
  const pipeline = [
    { $match: { timestamp: { $gte: start, $lte: now } } },
    {
      $group: {
        _id: "$artistId",
        total_seconds: { $sum: "$duration" },
        plays: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "artists",
        localField: "_id",
        foreignField: "_id",
        as: "artist"
      }
    },
    { $unwind: "$artist" },
    {
      $project: {
        artist_id: "$_id",
        artist_name: "$artist.name",
        total_seconds: 1,
        plays: 1
      }
    },
    { $sort: { total_seconds: -1 } }
  ];

  printjson(db.streams.aggregate(pipeline).toArray());
}


// ==============================================
// 2) TOP 10 CANCIONES EN GUATEMALA (7 días)
// ==============================================
print("\n=== 2) Top 10 canciones en Guatemala (últimos 7 días) ===");

{
  const start = daysAgo(7);

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: start, $lte: now },
        country: "GT"
      }
    },
    { $group: { _id: "$songId", plays: { $sum: 1 } } },
    {
      $lookup: {
        from: "songs",
        localField: "_id",
        foreignField: "_id",
        as: "song"
      }
    },
    { $unwind: "$song" },
    {
      $lookup: {
        from: "artists",
        localField: "song.artistId",
        foreignField: "_id",
        as: "artist"
      }
    },
    { $unwind: "$artist" },
    {
      $project: {
        song_id: "$_id",
        title: "$song.title",
        artist: "$artist.name",
        plays: 1
      }
    },
    { $sort: { plays: -1 } },
    { $limit: 10 }
  ];

  printjson(db.streams.aggregate(pipeline).toArray());
}


// ==============================================
// 3) USUARIOS ZOMBIS — Versión simple
// (users SIN streams últimos 30 días)
// ==============================================

print("\n=== 3) Usuarios Zombis (sin streams últimos 30 días) ===");

{
  const cutoff = daysAgo(30);

  const pipeline = [
    {
      $lookup: {
        from: "streams",
        let: { uid: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$uid"] },
                  { $gte: ["$timestamp", cutoff] }
                ]
              }
            }
          },
          { $limit: 1 }
        ],
        as: "recent_activity"
      }
    },
    { $match: { recent_activity: { $size: 0 } } },
    {
      $project: {
        user_id: "$_id",
        name: 1,
        email: 1
      }
    }
  ];

  printjson(db.users.aggregate(pipeline).toArray());
}


// ==============================================
// 4) DEMOGRAFÍA — NO HAY GENRE
// → Solo contar usuarios por canción reproducida
// ==============================================
print("\n=== 4) Conteo de usuarios por canción (últimos 60 días) ===");

{
  const start = daysAgo(60);

  const pipeline = [
    { $match: { timestamp: { $gte: start, $lte: now } } },
    { $group: { _id: "$songId", count_users: { $addToSet: "$userId" } } },
    {
      $project: {
        song_id: "$_id",
        unique_users: { $size: "$count_users" }
      }
    },
    { $sort: { unique_users: -1 } }
  ];

  printjson(db.streams.aggregate(pipeline).toArray());
}


// ==============================================
// 5) HEAVY USERS – Bad Bunny
// ==============================================

print("\n=== 5) Heavy Users (Bad Bunny) ===");

{
  const artist = db.artists.findOne({ name: /bad bunny/i });

  if (!artist) {
    print("Bad Bunny no existe en artists");
  } else {
    const pipeline = [
      { $match: { artistId: artist._id } },
      { $group: { _id: { userId: "$userId", songId: "$songId" } } },
      { $group: { _id: "$_id.userId", distinct_songs: { $sum: 1 } } },
      { $sort: { distinct_songs: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          user_id: "$_id",
          name: "$user.name",
          distinct_songs: 1
        }
      }
    ];

    printjson(db.streams.aggregate(pipeline).toArray());
  }
}

print("\n=== END ===");
