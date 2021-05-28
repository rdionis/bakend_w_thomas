const express = require("express");
const axios = require("axios");
const app = express(); //this is creating a server
const port = 5000;

app.get("/", (req, res) => {
  console.log("This is our first express class");
  res.write("<h1>Hello world</h1>");
  res.end();
});

// REST Architecture
//users/1/texts/4/paragraph/2
app.get("/users", (req, res) => {
  res.end();
});
// variable in url :id
app.get("/users/:id", (req, res) => {
  //1. receive ID over URL
  const userId = req.params.id;
  //2. request external endpoint/resource
  axios
    //axios.get returns PROMISE because the request takes a few ms
    .get("https://jsonplaceholder.typicode.com/users/" + userId)
    // wait for the PROMISE with then
    .then(function (response) {
      //3. handle the response
      console.log(response.data);
      res.json(response.data);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
