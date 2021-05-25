const http = require("http");
const server = http.createServer((req, res) => {
  // endpoint / route
  console.log("This is only visible on the server, its a " + req.method + " request");
  console.log(req);
  // the client never sees this
  res.end("hello"); // This flies back to the client - this is what the client sees
});
server.listen(5000);
