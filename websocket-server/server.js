// ✅ Finaler Code für deinen server.js auf Render (100% funktional)
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

  let payload;

  // Wenn der Webhook ein Reset auslöst
  if (feldId === 'resetBingo') {
    payload = JSON.stringify({ type: "resetBingo" });
  } else {
    payload = JSON.stringify({ type: "gift", feldId });
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  res.status(200).send("OK");
});

// KeepAlive-Route für Render
app.get("/", (req, res) => {
  res.send("✅ Der Bingo-Overlay-Server läuft.");
});

// Server starten
http.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});

// Ping alle 10 Minuten
setInterval(() => {
  const payload = JSON.stringify({ type: 'ping' });
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
  console.log("[SERVER] Ping gesendet an alle Clients");
}, 10 * 60 * 1000);
