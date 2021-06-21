const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const app = express(); //this is creating a server
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/personliker", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json()); //this replaces the bodyParser

const port = 5000;
const saltRounds = 10;

//const salt = bcrypt.genSaltSync(saltRounds);
const salt = "$2b$10$3Vo06yeDbV8UPtiNU/qI4e";

//using EXPRESS

const Person = mongoose.model("Person", {
  name: String,
  email: String,
  password: String,
  verificationhash: String,
  verifiedAt: Date,
});

app.get("/", (req, res) => {
  //console.log("This is our first express class");
  res.json({ message: "Hello, world" });
});

// REST Architecture
//users/1/texts/4/paragraph/2
app.get("/users", (req, res) =>
  axios.get("https://jsonplaceholder.typicode.com/users").then(function (response) {
    Person.find().then((people) => {
      const mergedPeople = response.data.map((personFromJP) => {
        personFromJP.liked = people.findIndex((p) => p.email === personFromJP.email) >= 0; //same as !== -1 (inexistent index)
        //console.log(personFromJP.liked);
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
      //console.log(response.data);
      res.json(response.data);
    });
});

app.post("/users/like", (req, res) => {
  //console.log(req.body);
  const newPerson = new Person({
    name: req.body.name,
    email: req.body.email,
  });
  newPerson.save().then(() => {
    //console.log("Person saved");
    res.json({ message: "success", user: { ...newPerson._doc, liked: true } });
  });
});

app.post("/users/register", async (req, res) => {
  //console.log(req.body);
  const savedPerson = await Person.findOne({
    email: req.body.email,
  });
  //console.log(savedPerson);
  if (!savedPerson) {
    // 1 create verificationhash
    const verificationhash = uuid();
    // 2 create db object

    //console.log("SALT:" + salt);
    const bcryptHash = bcrypt.hashSync(req.body.password.toString(), salt);

    const newPerson = new Person({
      name: req.body.name,
      email: req.body.email,
      password: bcryptHash,
      verificationhash: verificationhash,
    });
    // newPerson.save().then(() => {
    //   console.log("Person saved");
    //   res.json({ message: "success", user: newPerson._doc });
    // });
    try {
      await newPerson.save();
      //console.log("Person saved");

      const nodemailer = require("nodemailer");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "raqwebdev@gmail.com",
          pass: "thisisannoying", // naturally, replace both with your real credentials or an application-specific password
        },
      });

      const mailOptions = {
        from: "verificationEmail@verification.com",
        to: req.body.email,
        subject: "Verification email",
        text: `Back-end is fun: ${req.protocol}://${req.headers.host}/users/verify/${newPerson.verificationhash}`,
        //http://localhost:3000/users/verify/8247318921hjkfh829478293
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.json({ message: "success", user: newPerson._doc });
    } catch (error) {
      throw error;
    }

    // 3 create email
  } else {
    res.json({ message: "User with " + req.body.email + " already exists" });
  }
});
// 1
app.get("/users/verify/:hash", async (req, res) => {
  //the colon indicates a variable/dynamic part of the URL)
  const hash = req.params.hash;
  //console.log(hash);
  // 1 find the user BY the hash
  const toBeVerified = await Person.findOne({ verificationhash: hash });
  //console.log(toBeVerified);
  // 2 update some field to reflect that this user is now able to login since he/she is verified
  toBeVerified.verifiedAt = Date.now();
  await toBeVerified.save();
  res.json({ message: `User with the email ${toBeVerified.email} is now verified.` });
});

// 3 login route

app.post("/users/login", async (req, res) => {
  const foundPerson = await Person.findOne({ email: req.body.email });
  //console.log(foundPerson);
  //console.log("SALT:" + salt);
  const bcryptHash = bcrypt.hashSync(req.body.password.toString(), salt);
  //console.log(bcryptHash);
  //console.log(foundPerson.password);
  // 4 checks if the user which tries to login has a verifiedAt field
  if (!foundPerson.verifiedAt) {
    res.json({ message: `User ${foundPerson} is not yet verified.` });
  } else {
    if (bcryptHash !== foundPerson.password) {
      res.json({ message: `Password does not match.` });
    } else {
      const token = jwt.sign({ userId: foundPerson.id }, "secretKey");
      //console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2MjQyODM4NzR9.iFd6k-bb1fjFc5smBRkrQzlxz2v6N9cVGOgCKaa2DvQ - ALWAYS STARTS WITH ey
      res.json({ message: `User ${foundPerson} is now logged in.`, token: token });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
