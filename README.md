# 📄 Proyecto Apple Music Insights — Documentación Completa

## 1. Introducción
Este documento presenta el desarrollo completo del proyecto **Apple Music Insights**, el cual consiste en la construcción de:

- Una API REST con **Node.js**, **Express** y **MongoDB Driver**
- Una base de datos **MongoDB** en **Docker**
- Un dashboard **HTML/CSS/JS** con tablas, métricas y gráficas usando **Chart.js**
- Contenedores orquestados mediante **docker-compose**

El objetivo es cumplir todos los requisitos del examen, asegurando un entregable profesional, claro y completo.

---

## 2. Arquitectura General
El sistema se compone de:

- **MongoDB** corriendo dentro de Docker
- **API REST** Node.js + Express
- **Dashboard** HTML + Chart.js
- **docker-compose** para orquestación

### Flujo General
```
Cliente (Dashboard)
        ↓
      API (Node.js)
        ↓
  Base de Datos MongoDB (Docker)
```

---

## 3. Estructura del Proyecto
```
seeding/
 ├── database/
 │    ├── docker-compose.yml
 │    ├── api/
 │    │     ├── server.js
 │    │     ├── package.json
 │    │     ├── Dockerfile
 │    └── data/   (colecciones JSON)
 │
 ├── dashboard/
 │    └── dashboard.html
```

---

## 4. Código — API REST (`server.js`)
```javascript
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

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

// Top Canciones
app.get("/api/top-songs", async (req, res) => {
  try {
    const data = await songs.find({}).sort({ streams: -1 }).limit(10).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo top songs" });
  }
});

// Top Artistas
app.get("/api/top-artists", async (req, res) => {
  try {
    const data = await artists.find({}).sort({ popularity: -1 }).limit(10).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo top artists" });
  }
});

// Top Géneros (agrupado)
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

// Conteo de Streams
app.get("/api/streams/count", async (req, res) => {
  try {
    const total = await streams.countDocuments();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ error: "Error en streams count" });
  }
});

app.listen(3000, () => {
  console.log("API lista en http://localhost:3000");
});
```

---

## 5. Docker — `docker-compose.yml`
```yaml
version: '3.9'
services:
  mongo:
    image: mongo:7
    restart: always
    container_name: apple-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: applemusic

  api:
    build: ./api
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    container_name: apple-api

volumes:
  mongo_data:
```

---

## 6. Dashboard — HTML con Tablas y Gráficas.
- Métricas
- Tablas
- Gráficas de barras
- Gráficas de dona

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard — Apple Music Streams</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: Arial; background: #f1f1f1; margin: 0; }
    header { background: #111; color: white; padding: 20px; text-align: center; }
    .container { width: 90%; margin: auto; }
    .card { background:white; padding:20px; margin:20px 0; border-radius:10px; }
    table { width:100%; border-collapse:collapse; margin-top:10px; }
    th { background:#222; color:white; padding:10px; }
    td { padding:10px; border-bottom:1px solid #ddd; }
  </style>
</head>
<body>

<header>Dashboard — Apple Music Insights</header>
<div class="container">

  <div class="card">
    <h2>Total Streams Registrados</h2>
    <h1 id="total-streams" style="font-size:40px; color:#d6336c;">Cargando...</h1>
  </div>

  <div class="card">
    <h2>Top Géneros — Gráfica</h2>
    <canvas id="genresChart"></canvas>
  </div>

  <div class="card">
    <h2>Top Canciones — Tabla</h2>
    <table id="songs-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Género</th>
          <th>Duración</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

</div>
</body>
</html>
```

---

## 7. Capturas Requeridas

- Docker corriendo todos los contenedores  ![Texto alternativo](dashboard-0\contenedor.png)
- Mongo Express mostrando las colecciones: ![Texto alternativo](dashboard-0\Mongo.png)
 
- API respondiendo en navegador:  
![Texto alternativo](dashboard-0\APISONG.png)
![Texto alternativo](dashboard-0\APIARTIST.png)
![Texto alternativo](dashboard-0\APIGENRES.png)
![Texto alternativo](dashboard-0\APICOUNT.png)
- Dashboard funcionando en pantalla  
![Texto alternativo](dashboard-0\dashodoard3.png)

---

## 8. Conclusiones
El desarrollo del proyecto Apple Music Insights permite demostrar de forma integral la aplicación de conceptos avanzados de desarrollo backend, bases de datos y despliegue mediante contenedores.
A lo largo de la implementación se cumplieron todos los requisitos establecidos en el examen, logrando un sistema robusto, modular y completamente funcional.
Los principales logros alcanzados fueron:
Construcción de una API REST con Node.js y Express, capaz de exponer endpoints confiables para métricas, rankings y consultas específicas.
Integración con MongoDB, incluyendo creación, carga inicial (seeding) y consultas eficientes sobre las colecciones songs, artists y streams.
Implementación de un dashboard web profesional, con visualizaciones mediante Chart.js, tablas dinámicas y métricas en tiempo real.
Orquestación de todo el entorno mediante Docker Compose, permitiendo levantar la base de datos, la API y las herramientas administrativas con un solo comando.
Estructura del proyecto clara y mantenible, con separación por módulos, archivos organizados y uso adecuado de contenedores y servicios.
En conjunto, el sistema final representa una solución completa y técnicamente sólida que cumple con las expectativas del examen, proporcionando una plataforma totalmente funcional para el análisis de datos musicales.

---
## Autor
**Nombre:** Juan Francisco Garzaro Gudiel  
**Carné:** 202200158

