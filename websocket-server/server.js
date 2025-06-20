const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket verbunden");

  ws.on("close", () => console.log("❌ WebSocket getrennt"));
});

app.use(express.json());

app.post("/ngrok-webhook", (req, res) => {
  const { fieldId } = req.body;

  if (fieldId) {
    console.log("📩 TikFinity POST:", fieldId);
    const message = JSON.stringify({ type: "gift", feldId: fieldId });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`🌐 Server läuft auf Port ${PORT}`));

