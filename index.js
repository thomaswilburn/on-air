var server = require("./staticServer");
var StudioManager = require("./studioManager.js");
var WebSocketServer = require("./wsServer");

var wsServer = new WebSocketServer(server);

var manager = new StudioManager();

var updateClients = function(e) {
  wsServer.broadcast({ type: "studio-update", rooms: manager.complex });
};

manager.on("changed", updateClients);
manager.on("updated", updateClients);

wsServer.on("connected", updateClients);

wsServer.on("studio-toggle", function(message) {
  manager.updateRoom(message.key, message.active);
});

wsServer.on("studio-add", function(message) {
  manager.addRoom(message.name);
});

wsServer.on("studio-remove", function(message) {
  manager.removeRoom(message.key);
});