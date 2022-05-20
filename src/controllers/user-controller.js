const Database = require("../db");
const assert = require("assert");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const { type } = require("os");
const saltRounds = 10;

const controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Message: "invalid email" });
    }

    let { firstName, lastName, emailAdress, password, street, city } = user;

    try {
      assert(
        typeof firstName == "string",
        "first name must be a string/ must be provided in request"
      );
      assert(
        typeof lastName == "string",
        "last name must be a string/ must be provided in request"
      );
      assert(
        typeof emailAdress == "string",
        "email must be a string/ must be provided in request"
      );
      assert(
        typeof password == "string",
        "password must be a string/ must be provided in request"
      );

      assert(
        typeof street == "string",
        "street must be a string/ must be provided in request"
      );
      assert(
        typeof city == "string",
        "city must be a string/ must be provided in request"
      );

      assert.match(emailAdress, emailRegex, "Email address must be valid");
      next();
    } catch (err) {
      console.log(err);
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

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      if (err) {
        res.status(400).json({
          Status: 400,
          Message: `Something went wrong`,
        });
      }
      Database.query(
        "INSERT INTO user (firstName,lastName,isActive,emailAdress,password,phoneNumber,street,city) VALUES(?,?,?,?,?,?,?,?);  SELECT  * from `user` WHERE id = LAST_INSERT_ID()",
        [
          user.firstName,
          user.lastName,
          user.isActive,
          user.emailAdress,
          hash,
          user.phoneNumber,
          user.street,
          user.city,
        ],
        (err, rows, fields) => {
          if (err) {
            if (err.code == "ER_DUP_ENTRY") {
              res.status(409).json({
                message: `Email already exists`,
              });
            } else {
              console.log(err);
              res.status(400).json({
                message: `Something went wrong`,
              });
            }
          } else {
            res.status(201).json({
              result: rows[1],
            });
          }
        }
      );
    });
  },

  getUserById: (req, res) => {
    if (typeof req.jwtUserId !== "undefined") {
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
            console.log("hier?");
            res.status(404).json({
              Status: 404,
              Message: `ID does not exist`,
            });
          } else {
            res.send(rows);
          }
        }
      );
    } else {
      res.status(401).json({
        status: 400,
        message: `Not logged in`,
      });
    }
  },

  editUser: (req, res) => {
    if (typeof req.jwtUserId !== "undefined") {
      const userID = req.params.userId;
      let user = req.body;

      bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) {
          res.status(400).json({
            Status: 400,
            Message: `Something went wrong`,
          });
        }
        Database.query(
          "update user set firstName =?, lastName =?, isActive =?, emailAdress = ?, password =?, phoneNumber =?, street =?, city =? WHERE id = ? ",
          [
            user.firstName,
            user.lastName,
            user.isActive,
            user.emailAdress,
            hash,
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
              console.log(rows.affectedRows);

              res.status(200).json(req.body);
              return;
            }
          }
        );
      });
    } else {
      res.status(401).json({
        status: 400,
        message: `Not logged in`,
      });
    }
  },

  deleteUser: (req, res) => {
    if (typeof req.jwtUserId !== "undefined") {
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
    } else {
      res.status(401).json({
        status: 400,
        message: `Not logged in`,
      });
    }
  },

  getUsers: (req, res) => {
    if (typeof req.jwtUserId !== undefined) {
      let numberOfUsers = req.query.numberOfUsers;
      let isActive = req.query.isActive;

      if (
        (typeof numberOfUsers !== "undefined") &
        (typeof isActive == "undefined")
      ) {
        Database.query(
          "SELECT * FROM user LIMIT ? ",
          [parseInt(numberOfUsers)],
          (err, rows, fields) => {
            if (err) {
              console.log(err);
              res.status(400).json({
                Status: 400,
                Message: `Something went wrong`,
              });
            } else {
              res.send(rows);
            }
          }
        );
      } else if (
        (typeof numberOfUsers == "undefined") &
        (typeof isActive !== "undefined")
      ) {
        Database.query(
          "SELECT * FROM user WHERE isActive = ? ",
          [parseInt(isActive)],
          (err, rows, fields) => {
            if (err) {
              console.log(err);
              res.status(400).json({
                Status: 400,
                Message: `Something went wrong`,
              });
            } else {
              res.send(rows);
            }
          }
        );
      } else if (
        (typeof numberOfUsers !== "undefined") &
        (typeof isActive !== "undefined")
      ) {
        console.log("aha");
        Database.query(
          "SELECT * FROM `user` WHERE isActive = ? LIMIT ? ",
          [parseInt(isActive), parseInt(numberOfUsers)],
          (err, rows, fields) => {
            if (err) {
              console.log(err);
              res.status(400).json({
                Status: 400,
                Message: `Something went wrong`,
              });
            } else {
              res.send(rows);
            }
          }
        );
      } else {
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
      }
    } else {
      res.status(401).json({
        status: 400,
        message: `Not logged in`,
      });
    }
  },

  getUserProfile: (req, res) => {
    if (typeof req.jwtUserId !== "undefined") {
      Database.query(
        "SELECT * FROM user WHERE id = ?",
        [req.jwtUserId],
        (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              Status: 400,
              Message: `Something went wrong`,
            });
          } else {
            res.send(rows);
          }
        }
      );
    } else {
      res.status(401).json({
        status: 400,
        message: `Not logged in`,
      });
    }
  },
};

module.exports = controller;
