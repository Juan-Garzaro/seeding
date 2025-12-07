db = db.getSiblingDB('applemusic');
db.createCollection('users');
db.createCollection('artists');
db.createCollection('songs');
db.createCollection('streams');

db.streams.createIndex({ song_id: 1, played_at: -1 });
db.streams.createIndex({ user_id: 1, played_at: -1 });
db.streams.createIndex({ artist_id: 1 });
db.streams.createIndex({ region: 1, played_at: -1 });

db.users.createIndex({ email: 1 }, { unique: true });

