const Database = require("../db");
const assert = require("assert");
const { validationResult } = require("express-validator");

const JWT = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.SECRET_JWT_KEY;

const bcrypt = require("bcrypt");

const controller = {
  validateLogin: (req, res, next) => {
    let user = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Message: "invalid email" });
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

  validateToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: "Authorization header missing!",
        datetime: new Date().toISOString(),
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
      "SELECT `id`, `emailAdress`,`password`,`firstName`,`lastName` FROM `user` WHERE `emailAdress` = ?",
      [emailaddress],
      (err, rows, fields) => {
        if (err) {
          // logger.error("Error: ", err.toString());
          res.status(500).json({
            error: err.toString(),
            datetime: new Date().toISOString(),
          });
        }
        if (rows && rows.length === 1) {
          const user = rows[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              JWT.sign(
                { userid: user.id },
                privateKey,
                { expiresIn: "7d" },
                (err, token) => {
                  if (err) console.log(err);
                  res.status(200).json({
                    Status: 200,
                    result: token,
                  });
                }
              );
            } else {
              res.status(404).json({
                message: "password is incorrect",
              });
            }
          });
        } else {
          res.status(404).json({
            message: "Email is incorrect",
          });
        }
      }
    );
  },
};

module.exports = controller;
