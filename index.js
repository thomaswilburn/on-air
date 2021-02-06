var server = require("./staticServer");
var StudioManager = require("./studioManager.js");
var WebSocketServer = require("./wsServer");

var wsServer = new WebSocketServer(server);

wsServer.on("ping", () => console.log("pong"));