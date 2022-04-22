const router = require("express").Router();

let database = [];
let databaseID = database.length;

database.push({
  id: databaseID,
  firstName: "John",
  lastName: "Doe",
  street: "Lovensdijkstraat 61",
  city: "Breda",
  isActive: true,
  emailAdress: "j.doe@server.com",
  password: "secret",
  phoneNumber: "06 12425475",
});

// adds a user
router.post("/", function (req, res) {
  const user = req.body;
  const emailAdress = req.body.emailAdress;

  if (emailAdress != null) {
    if (database.filter((item) => item.emailAdress == emailAdress).length > 0) {
      res.status(400).json({
        Status: 400,
        Message: `A user with this Email adress already exists!`,
      });
    } else {
      databaseID++;
      database.push({
        id: databaseID,
        ...user,
      });
      res.json(database.filter((item) => item.emailAdress == emailAdress));
    }
  } else {
    res.status(400).json({
      Status: 400,
      Message: `body does not contain emailAdress field`,
    });
  }
});

// selects a specific user
router.get("/:userId", function (req, res) {
  const userID = req.params.userId;
  const selectedUser = database.filter((item) => item.id == userID);
  if (selectedUser.length > 0) {
    res.send(database[userID]);
  }
});

// updates a user
router.put("/:userId", function (req, res) {
  let email = req.body.emailAdress;
  const userID = req.params.userId;
  let user = req.body;

  let item = database.filter((item) => item.emailAdress == email);
  if (item.length > 0) {
    if (req.params.userId != item[0].id) {
      res.status(400).json({
        Status: 400,
        Message: `Email already used!`,
      });
    } else {
      user = { id: userID, ...user };
      database[userID] = user;
      res.send(database[userID]);
    }
  } else {
    user = { id: userID, ...user };
    database[userID] = user;
    res.send(database[userID]);
  }
});


// deletes a user
router.delete("/:userId", function (req, res) {
  const userID = req.params.userId;
  let user = req.body;
  try {
    const selectedUser = database.filter((item) => item.id == userID);
    if (selectedUser.length > 0) {
      database.splice(userID, 1);
    }
    res.status(200).json({
      Status: 200,
      Message: `User succesfully deleted!`,
    });
  } catch (Exception) {
    res.status(400).json({
      Status: 400,
      Message: `body does not contain emailAdress field`,
    });
  }
});

// gets all users
router.get("/", function (req, res) {
  res.send(database);
});

// beginning route of profile details
router.get("/profile", function (req, res) {
  res.status(200).json({
    Status: 200,
    Message: `Requires JWT implementation, still in progress`,
  });
});

module.exports = router;
