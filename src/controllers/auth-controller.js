const Database = require("../db");
const assert = require("assert");
const { validationResult } = require("express-validator");

const JWT = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.SECRET_JWT_KEY;

const bcrypt = require("bcrypt");

const controller = {
  validateLogin: (req, res, next) => {
    const user = req.body;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "invalid request" });
    }

    let { emailaddress, password } = user;

    try {
      assert(
        emailaddress != null,
        "emailaddress/password must be provided in request"
      );
      assert(
        password != null,
        "emailaddress/password must be provided in request"
      );
      
      assert(typeof emailaddress == "string", "Emailaddress must be a string");
      assert.match(emailaddress, emailRegex, "Email address must be valid");
      assert(typeof password == "string", "password must be a string");
      next();
    } catch (err) {
      // console.log(err);
      res.status(400).json({
        statusCode: 400,
        message: err.message
      });
    }
  },

  validateToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        message: "Not authorized",
      });
    } else {
      // Strip the word 'Bearer ' from the headervalue
      const token = authHeader.substring(7, authHeader.length);

      JWT.verify(token, privateKey, (err, payload) => {
        if (err) {
          res.status(401).json({
            error: "Not authorized",
            datetime: new Date().toISOString(),
          });
        }
        if (payload) {
          // User heeft toegang. Voeg UserId uit payload toe aan
          // request, voor ieder volgend endpoint.
          req.jwtUserId = payload.userId;
          next();
        }
      });
    }
  },


  login: (req, res) => {
    const { emailaddress, password } = req.body;
    Database.query(
      "SELECT * FROM `user` WHERE `emailAdress` = ?",
      [emailaddress],
      (err, rows, fields) => {
        if (err) {
          // logger.error("Error: ", err.toString());
          res.status(500).json({
            message: err.toString(),
          });
        }
        if (rows && rows.length === 1) {
          let user = rows[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              JWT.sign(
                { userId: user.id },
                privateKey,
                { expiresIn: "7d" },
                (err, token) => {
                  if (err) console.log(err);
                  user.token = token;
                  res.status(200).json({
                    result: user,
                  });
                }
              );
            } else {
              res.status(400).json({
                statusCode: 400,
                message: "password is incorrect",
              });
            }
          });
        } else {
          res.status(404).json({
            statusCode: 404,
            message: "Email is incorrect",
          });
        }
      }
    );
  },
};

module.exports = controller;
