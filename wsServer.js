/*
  Minimal wrapper for the base WebSocket server
  Mostly simplifies message handling and broadcasting
*/
var ws = require("ws");
var { EventEmitter } = require("events");

class WebSocketServer extends EventEmitter {
  constructor(server) {
    super();
    this.server = new ws.Server({ server });
    this.onConnect = this.onConnect.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.server.on("connection", this.onConnect);
  }

  onConnect(socket) {
    console.log("Socket connected");
    socket.on("message", this.onMessage);
    socket.on("close", () => console.log("Socket closed"));
    this.emit("connected", socket);
  }

  // dispatches events based on the `type` property
  onMessage(message) {
    if (typeof message == "string") message = JSON.parse(message);
    var { type } = message;
    this.emit(type, message);
  }

  // send a message to all connected clients
  broadcast(message) {
    var { clients } = this.server;
    var serialized = JSON.stringify(message);
    clients.forEach(c => {
      if (c.readyState == ws.OPEN) c.send(serialized);
    });
  }
}

module.exports = WebSocketServer;