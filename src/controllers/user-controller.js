const Database = require("../db");
const assert = require("assert");
const { validationResult } = require("express-validator");

const controller = {
  validateUser: (req, res, next) => {
    let user = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Message: "invalid email" });
    }

    let { firstName, lastName, emailAdress, password } = user;

    try {
      assert(typeof firstName == "string", "first name must be a string");
      assert(typeof lastName == "string", "last name must be a string");
      assert(typeof emailAdress == "string", "email must be a string");
      assert(typeof password == "string", "password must be a string");
      next();
    } catch (err) {
      // console.log(err);
      res.status(400).json({
        Status: 400,
        Message: err.message,
      });
    }
  },

  addUser: (req, res) => {
    const user = req.body;
    if (user.isActive == null) {
      user.isActive = true;
    }
    Database.query(
      "INSERT INTO user (firstName,lastName,isActive,emailAdress,password,phoneNumber,street,city) VALUES(?,?,?,?,?,?,?,?)",
      [
        user.firstName,
        user.lastName,
        user.isActive,
        user.emailAdress,
        user.password,
        user.phoneNumber,
        user.street,
        user.city,
      ],
      (err, rows, fields) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            res.status(409).json({
              Status: 400,
              Message: `Email already exists`,
            });
          } else {
            console.log(err);
            res.status(400).json({
              Status: 400,
              Message: `Something went wrong`,
            });
          }
        } else {
          res.status(200).json({
            Status: 200,
            Message: `User succesfully added!`,
          });
        }
      }
    );
  },

  getUserById: (req, res) => {
    const userID = req.params.userId;
    Database.query(
      "SELECT * FROM user WHERE id =? ",
      [userID],
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            Status: 400,
            Message: `Something went wrong`,
          });
        } else if (rows.length === 0) {
          res.status(404).json({
            Status: 404,
            Message: `ID does not exist`,
          });
        } else {
          res.send(rows);
        }
      }
    );
  },

  editUser: (req, res) => {
    const userID = req.params.userId;
    let user = req.body;


    Database.query(
      "update user set firstName =?, lastName =?, isActive =?, emailAdress = ?, password =?, phoneNumber =?, street =?, city =? WHERE id = ? ",
      [
        user.firstName,
        user.lastName,
        user.isActive,
        user.emailAdress,
        user.password,
        user.phoneNumber,
        user.street,
        user.city,
        userID,
      ],
      (err, rows, fields) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY") {
            console.log(err);

            res.status(409).json({
              Status: 409,
              Message: `Email already exists`,
            });
          } else if (rows.length === 0) {
            res.status(404).json({
              Status: 404,
              Message: `ID does not exist`,
            });
          } else {
            console.log(err);
            res.status(400).json({
              Status: 400,
              Message: `Something went wrong`,
            });
          }
        } else {
          console.log(rows.affectedRows)
          
          res.status(200).json(req.body);
          return;
        }
      }
    );
  },

  deleteUser: (req, res) => {
    const userID = req.params.userId;
    let user = req.body;
    Database.query(
      "DELETE FROM user WHERE id = ?",
      [userID],
      (err, rows, fields) => {
        if (err) {
          res.status(400).json({
            Status: 400,
            Message: `Something went wrong`,
          });
        } else {
          res.status(200).json({
            Status: 200,
            Message: `User successfully deleted`,
          });
        }
      }
    );
  },

  getUsers: (req, res) => {
    Database.query("SELECT * FROM user", (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          Status: 400,
          Message: `Something went wrong`,
        });
      } else {
        res.send(rows);
      }
    });
  },

  getUserProfile: (req, res) => {
    res.status(200).json({
      Status: 200,
      Message: `Requires JWT implementation, still in progress`,
    });
  },
};

module.exports = controller;
