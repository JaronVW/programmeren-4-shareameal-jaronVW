let database = [];
let databaseID = database.length;
const assert = require("assert");

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

const controller = {
  validateUser: (req, res) => {
    let user = req.body;

    let {
      firstName,
      lastName,
      street,
      city,
      isActive,
      emailAdress,
      password,
      phoneNumber,
    } = user;

    try {
      assert(typeof firstName == "string", "first name must be a string");
      assert(typeof lastName == "string", "last name must be a string");
      assert(typeof emailAdress == "string", "email must be a string");
      assert(typeof password == "string", "password must be a string");
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({
        Status: 400,
        Message: "request body is incorrect",
      });
    }
  },

  addUser: (req, res) => {
    const user = req.body;
    const emailAdress = req.body.emailAdress;

    if (emailAdress != null) {
      if (
        database.filter((item) => item.emailAdress == emailAdress).length > 0
      ) {
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
  },

  getUserById: (req, res) => {
    const userID = req.params.userId;
    const selectedUser = database.filter((item) => item.id == userID);
    if (selectedUser.length > 0) {
      res.send(database[userID]);
    } else {
      res.status(400).json({
        Status: 400,
        Message: `user not found`,
      });
    }
  },

  editUser: (req, res) => {
    const userID = req.params.userId;

    let user = req.body;
    try {
      const selectedUser = database.filter((item) => item.id == userID);
      if (selectedUser.length > 0) {
        user = { id: userID, ...user };
        database[userID] = user;
        res.send(database[userID]);
      } else {
        res.status(400).json({
          Status: 400,
          Message: `user not found`,
        });
      }
    } catch (Exception) {
      res.status(400).json({
        Status: 400,
        Message: `Something went wrong`,
      });
    }
  },

  deleteUser: (req, res) => {
    const userID = req.params.userId;
    let user = req.body;
    try {
      const selectedUser = database.filter((item) => item.id == userID);
      if (selectedUser.length > 0) {
        database.splice(userID, 1);
        res.status(200).json({
          Status: 200,
          Message: `User succesfully deleted!`,
        });
      } else {
        res.status(400).json({
          Status: 400,
          Message: `user not found`,
        });
      }
    } catch (Exception) {
      res.status(400).json({
        Status: 400,
        Message: `body does not contain emailAdress field`,
      });
    }
  },

  getUsers: (req, res) => {
    res.send(database);
  },

  getUserProfile: (req, res) => {
    res.status(200).json({
      Status: 200,
      Message: `Requires JWT implementation, still in progress`,
    });
  },
};

module.exports = controller;
