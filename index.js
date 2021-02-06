// HTTP server comes pre-intialized
var server = require("./staticServer");

// load local dependencies
var StudioManager = require("./studioManager.js");
var WebSocketServer = require("./wsServer");

var wsServer = new WebSocketServer(server);
var manager = new StudioManager();

// in response to various events, send clients a copy of the room data
var updateClients = function(e) {
  wsServer.broadcast({ type: "studio-update", rooms: manager.complex });
};

manager.on("changed", updateClients);
manager.on("updated", updateClients);
wsServer.on("connected", updateClients);

// update the studio list when a room is toggled
wsServer.on("studio-toggle", message => manager.updateRoom(message.key, message.active));

// add and remove rooms
wsServer.on("studio-add", message => manager.addRoom(message.name));
wsServer.on("studio-remove", message => manager.removeRoom(message.key));