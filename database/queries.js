use("applemusic");

// =========================
//  USERS
// =========================
db.users.insertMany([
  {
    _id: "u1",
    name: "Juan Perez",
    email: "juan@example.com",
    country: "Guatemala",
    dob: "1995-06-15",
    subscription: "premium",
    last_active: new Date()
  },
  {
    _id: "u2",
    name: "Maria Lopez",
    email: "maria@example.com",
    country: "México",
    dob: "1998-10-22",
    subscription: "free",
    last_active: new Date()
  }
]);

// =========================
//  ARTISTS
// =========================
db.artists.insertMany([
  {
    _id: "a1",
    name: "Bad Bunny",
    country: "Puerto Rico",
    created_at: new Date()
  },
  {
    _id: "a2",
    name: "Taylor Swift",
    country: "USA",
    created_at: new Date()
  }
]);

// =========================
//  ALBUMS
// =========================
db.albums.insertMany([
  {
    _id: "al1",
    title: "YHLQMDLG",
    artistId: "a1",
    created_at: new Date()
  },
  {
    _id: "al2",
    title: "Midnights",
    artistId: "a2",
    created_at: new Date()
  }
]);

// =========================
//  SONGS
// =========================
db.songs.insertMany([
  {
    _id: "s1",
    title: "Safaera",
    albumId: "al1",
    artistId: "a1",
    genre: "Reggaeton",
    duration: 210,
    release_date: "2020-02-29"
  },
  {
    _id: "s2",
    title: "Tití me preguntó",
    albumId: "al1",
    artistId: "a1",
    genre: "Latin Trap",
    duration: 180,
    release_date: "2020-02-29"
  },
  {
    _id: "s3",
    title: "Anti-Hero",
    albumId: "al2",
    artistId: "a2",
    genre: "Pop",
    duration: 200,
    release_date: "2022-10-21"
  }
]);

// =========================
//  PLAYLISTS
// =========================
db.playlists.insertMany([
  {
    _id: "p1",
    name: "Favoritas de Juan",
    userId: "u1",
    created_at: new Date()
  },
  {
    _id: "p2",
    name: "Pop Hits",
    userId: "u2",
    created_at: new Date()
  }
]);

// =========================
//  PLAYLIST SONGS (N:N)
// =========================
db.playlistSongs.insertMany([
  { _id: "ps1", playlistId: "p1", songId: "s1" },
  { _id: "ps2", playlistId: "p1", songId: "s2" },
  { _id: "ps3", playlistId: "p2", songId: "s3" }
]);

// =========================
//  STREAMS (user plays song)
// =========================
db.streams.insertMany([
  {
    _id: "st1",
    user_id: "u1",
    song_id: "s1",
    artist_id: "a1",
    region: "GT",
    seconds_played: 150,
    played_at: new Date(),
    device: "iPhone",
    completed: false,
    session_id: "sess1"
  },
  {
    _id: "st2",
    user_id: "u2",
    song_id: "s3",
    artist_id: "a2",
    region: "MX",
    seconds_played: 200,
    played_at: new Date(),
    device: "Desktop",
    completed: true,
    session_id: "sess2"
  }
]);

print("✔ Datos insertados correctamente.");
