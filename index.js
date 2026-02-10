// npm install express

const express = require('express');
const app = express(); // Contenedor de Endpoints o WS RESTful

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ENDPOINT BASE
========================= */
app.get("/", async function (req, res) {
  const r = {
    message: "Nothing to send"
  };
  res.json(r);
});

/* =========================
   ENDPOINT /echo
   Regresa el mismo payload
========================= */
/*
Payload esperado:
{
  "id": "pt001",
  "lat": "99.1234567898765",
  "long": "-19.4567654566543"
}
*/
app.post("/echo", async function (req, res) {
  const cid = req.body.id;
  const clat = req.body.lat;
  const clong = req.body.long;

  const r = {
    id_e: cid,
    lat_e: clat,
    long_e: clong
  };

  res.json(r);
});

/* =========================
   ENDPOINT /fragmentar
   Fragmenta el JSON recibido
========================= */
app.post("/fragmentar", async function (req, res) {

  const cid = req.body.id;
  const clat = req.body.lat;
  const clong = req.body.long;

  const r = {
    fragmento_1: {
      id: cid
    },
    fragmento_2: {
      lat: clat,
      long: clong
    }
  };

  res.json(r);
});

/* =========================
   SERVIDOR
========================= */
app.listen(3000, function () {
  console.log("Aplicación ejemplo escuchando en el puerto 3000 🚀");
});

