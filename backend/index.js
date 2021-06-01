const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express(); //this is creating a server

app.use(cors());
app.use(express.json()); //this replaces the bodyParser

const port = 5000;

//using EXPRESS

app.get("/", (req, res) => {
  console.log("This is our first express class");
  res.json({ message: "Hello wold" });
});

// REST Architecture
//users/1/texts/4/paragraph/2
app.get("/users", (req, res) => {
  axios.get("https://jsonplaceholder.typicode.com/users").then(function (response) {
    res.json(response.data);
  }); //TODO also make a axios request, for simply all users and return all users for the user route
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

app.post("/users/like", (req, res) => {
  console.log(req.body);
  res.json({ message: "success" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
