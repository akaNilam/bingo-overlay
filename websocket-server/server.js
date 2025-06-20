// ✅ Finaler Code für deinen server.js auf Render (komplett ersetzen)
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ server: http });

app.use(express.json());

// WebSocket-Verbindung
wss.on("connection", (ws) => {
  console.log("Client verbunden");
});

// Webhook-Empfang von TikFinity
app.post("/ngrok-webhook", (req, res) => {
  const feldId = req.query.fieldId;
  console.log("Webhook erhalten:", feldId);

  const payload = JSON.stringify({ type: "gift", feldId });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.status(200).send("OK");
});

// Starte Server
http.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
