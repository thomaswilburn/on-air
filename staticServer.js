/*

A simple static file server.
It's no Express, but we don't need it, since most communication will be over WSS.

*/
var fs = require("fs").promises;
var http = require("http");
var path = require("path");

var server = new http.Server();
server.listen(8000);
server.on("listening", () => console.log("Server ready"));

var types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html"
}

server.on("request", async function(request, response) {
  var requested = request.url;
  if (requested == "/") requested = "index.html";
  var file = path.join("static", requested);
  var contents;
  try {
    contents = await fs.readFile(file);
  } catch (err) {
    // unable to read, send 404
    response.status = 404;
    response.end();
    return;
  }
  var mime = types[path.extname(requested)];
  response.setHeader("Content-Type", mime);
  response.write(contents);
  response.end();
});

module.exports = server;