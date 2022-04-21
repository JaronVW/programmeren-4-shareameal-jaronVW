const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(express.json());

let database = Array();
let id = 0;
database.push({
  id,
  movie: {
    Email: "jaron@jaron.jaron",
    Password: "password45",
  },
});

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal app",
  });
});

app.post("/api/user", function (req, res) {
  let user = req.body;
  id++;
  database.push({
    id,
    user
  });
  res.json(user);
  console.log(user);
});

app.put("/api/user/:userId", function (req, res) {
  const userID = req.params.userId;
  let user = req.body;
  const selectedUser = database.filter((item) => item.id == userID)
  if(selectedUser.length> 0){
    database[userID] = user
  }
  res.send(database[userID])
});

app.get("/api/user", function (req, res) {
  res.send(database)
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
