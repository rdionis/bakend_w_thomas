const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express(); //this is creating a server
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/personliker", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json()); //this replaces the bodyParser

const port = 5000;

//using EXPRESS

const Person = mongoose.model("Person", { name: String, email: String });

app.get("/", (req, res) => {
  console.log("This is our first express class");
  res.json({ message: "Hello, world" });
});

// REST Architecture
//users/1/texts/4/paragraph/2
app.get("/users", (req, res) =>
  axios.get("https://jsonplaceholder.typicode.com/users").then(function (response) {
    Person.find().then((people) => {
      const mergedPeople = response.data.map((personFromJP) => {
        personFromJP.liked = people.findIndex((p) => p.email === personFromJP.email) >= 0; //same as !== -1 (inexistent index)
        console.log(personFromJP.liked);
        return personFromJP;
      });
      res.json(mergedPeople);
    });
  })
);

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
  const newPerson = new Person({
    name: req.body.name,
    email: req.body.email,
  });
  newPerson.save().then(() => {
    console.log("Person saved");
    res.json({ message: "success", user: { ...newPerson._doc, liked: true } });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
