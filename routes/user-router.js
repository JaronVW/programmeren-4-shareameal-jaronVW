const router = require("express").Router();

let database = Array();
let id = 0;

database.push({
  id,
  movie: {
    Email: "jaron@jaron.jaron",
    Password: "password45",
  },
});

router.post("/", function (req, res) {
  let user = req.body;
  let email = user.emailAdress;

  if (database.filter((item) => item.emailAdress == email).length > 0) {
    res.status(400).json({
      Status: 400,
      Message: `An user with this Email adress already exists!`,
    });
  } else {
    id++;
    database.push({
      id,
      user,
    });
    res.json(user);
    console.log(user);
  }
});

router.put("/:userId", function (req, res) {
  const userID = req.params.userId;
  let user = req.body;
  const selectedUser = database.filter((item) => item.id == userID);
  if (selectedUser.length > 0) {
    database[userID] = user;
  }
  res.send(database[userID]);
});

router.get("/", function (req, res) {
  res.send(database);
});

module.exports = router;
