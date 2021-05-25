const express = require("express");
const app = express(); //this is creating a server
const port = 5000;

app.get("/", (req, res) => {
  console.log("This is our first express class");
  res.write("<h1>First</h1>");
  res.end("Goodbye");
});

app.get("/last", (req, res) => {
  console.log("Last example for today");
  res.write("<h1>Last</h1>");
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
