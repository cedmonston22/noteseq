const http = require("http");
const { WebSocketServer } = require("ws");
const Y = require("yjs");

const docs = new Map();

function getDoc(name) {
  if (!docs.has(name)) {
    docs.set(name, new Y.Doc());
  }
  return docs.get(name);
}

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Yjs WebSocket server");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const roomName = url.pathname.slice(1) || "default";
  const doc = getDoc(roomName);

  // Send current state to new client
  const state = Y.encodeStateAsUpdate(doc);
  ws.send(state);

  ws.on("message", (data) => {
    try {
      const update = new Uint8Array(data);
      Y.applyUpdate(doc, update);

      // Broadcast to all other clients in the same room
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(update);
        }
      });
    } catch (e) {
      // Ignore malformed messages
    }
  });

  ws.on("close", () => {
    // Clean up empty rooms
    let hasClients = false;
    wss.clients.forEach(() => { hasClients = true; });
    if (!hasClients && docs.has(roomName)) {
      docs.delete(roomName);
    }
  });
});

const PORT = 4444;
server.listen(PORT, () => {
  console.log(`Yjs WebSocket server running on ws://localhost:${PORT}`);
});
