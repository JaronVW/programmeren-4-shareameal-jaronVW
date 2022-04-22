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
      Message: `body does not emailAdress field`,
    });
  }
});

router.get("/:userId", function (req, res) {
  const userID = req.params.userId;
  const selectedUser = database.filter((item) => item.id == userID);
  if (selectedUser.length > 0) {
    res.send(database[userID]);
  }
});

router.put("/:userId", function (req, res) {
  const userID = req.params.userId;
  let user = req.body;
  const emailAdress = req.body.emailAdress;

  try{
    
  }catch(Exception){
    res.status(400).json({
        Status: 400,
        Message: `body does not emailAdress field`,
      });
  }
});

router.get("/", function (req, res) {
  res.send(database);
});

module.exports = router;
