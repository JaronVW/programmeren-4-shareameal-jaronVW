const Database = require("../db");
const assert = require("assert");

const controller = {
  getAllMeals: (req, res) => {
    if (typeof req.jwtUserId === "undefined") {
      res.status(400).json({
        statusCode: 400,
        message: `Not logged in`,
      });
    } else {
      Database.query("SELECT * FROM meal", (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            statusCode: 400,
            message: `Something went wrong`,
          });
        } else {
          res.status(200).json({ result: rows });
        }
      });
    }
  },

  getMealById: (req, res) => {
    if (typeof req.jwtUserId === "undefined") {
      res.status(400).json({
        statusCode: 400,
        message: `Not logged in`,
      });
    } else {
      const mealId = req.params.mealId;
      Database.query(
        "SELECT * FROM meal WHERE id = ?",
        [mealId],
        (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              statusCode: 400,
              message: `Something went wrong`,
            });
          } else {
            if (rows.length == 0) {
              res.status(404).json({
                statusCode: 404,
                message: `Meal not found`,
              });
            } else {
              res.send({ result: rows });
            }
          }
        }
      );
    }
  },

  validateMeal: (req, res, next) => {
    let meal = req.body;

    let {
      name,
      description,
      isActive,
      isVega,
      isVegan,
      isToTakeHome,
      imageUrl,
      allergenes,
      maxAmountOfParticipants,
      price,
    } = meal;

    try {
      assert(name != null, "name must be provided in request");
      assert(description != null, "description must be provided in request");

      assert(isActive != null, "isActive must be provided in request");
      assert(isVega != null, "isVega must be provided in request");

      assert(isVegan != null, "isVegan must be provided in request");
      assert(isToTakeHome != null, "isToTakeHome must be provided in request");

      assert(imageUrl != null, "imageUrl must be provided in request");

      assert(
        maxAmountOfParticipants != null,
        "maxAmountOfParticipants must be provided in request"
      );
      assert(price != null, "price must be provided in request");

      assert(typeof name == "string", "name must be a string");
      assert(typeof description == "string", "description must be a string");
      assert(typeof isActive == "boolean", "isActive must be a boolean");
      assert(typeof isVega == "boolean", "isVega must be a boolean");
      assert(typeof isVegan == "boolean", "isVegan must be a boolean");
      assert(
        typeof isToTakeHome == "boolean",
        "isToTakeHome must be a boolean"
      );
      assert(typeof imageUrl == "string", "imageUrl must be a string");
      assert(
        typeof maxAmountOfParticipants == "number",
        "maxAmountOfParticipants must be a number"
      );
      assert(typeof price == "number", "price must be a number");
      next();
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        message: err.message,
      });
    }
  },

  addMeal: (req, res) => {
    const meal = req.body;
    if (typeof req.jwtUserId === "undefined") {
      res.status(400).json({
        statusCode: 400,
        message: `Not logged in`,
      });
    } else {
      const date = new Date().toISOString().slice(0, 19).replace("T", " ");
      Database.query(
        "INSERT INTO `meal`(`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `createDate`, `updateDate`, `name`, `description`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?); SELECT  * from `meal` WHERE id = LAST_INSERT_ID();",
        [
          meal.isActive,
          meal.isVegan,
          meal.isVega,
          meal.isToTakeHome,
          meal.dateTime,
          meal.maxAmountOfParticipants,
          meal.price,
          meal.imageUrl,
          req.jwtUserId,
          date,
          date,
          meal.name,
          meal.description,
          // meal.allergenes,
        ],
        (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              statusCode: 400,
              message: `Something went wrong`,
            });
          } else {
            res.status(201).json({
              result: rows[1],
            });
          }
        }
      );
    }
  },

  updateMealById: (req, res) => {
    if (typeof req.jwtUserId !== "undefined") {
      const mealId = req.params.mealId;
      const meal = req.body;
      Database.query(
        "SELECT id FROM meal WHERE id = ?; SELECT id, cookId FROM meal WHERE id = ? AND cookId = ?",
        [mealId, mealId, req.jwtUserId],
        (err, rows, fields) => {
          if (rows[0].length !== 0) {
            if (rows[1].length !== 0) {
              if (err) {
                res.status(400).json({
                  statusCode: 400,
                  message: `Something went wrong`,
                });
              }
              const date = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              allergenesString = meal.allergenes.toString();
              Database.query(
                "UPDATE `meal` SET `isActive`=?,`isVega`=?,`isVegan`=?,`isToTakeHome`=?,`maxAmountOfParticipants`=?,`price`=?,`imageUrl`=?,`cookId`=?,`updateDate`=?,`name`=?,`description`=?,`allergenes` =? WHERE id = ?",
                [
                  meal.isActive,
                  meal.isVega,
                  meal.isVegan,
                  meal.isToTakeHome,
                  meal.maxAmountOfParticipants,
                  meal.price,
                  meal.imageUrl,
                  req.jwtUserId,
                  date,
                  meal.name,
                  meal.description,
                  allergenesString,
                  mealId,
                ],
                (err, rows, fields) => {
                  if (err) {
                    console.log(err);
                    res.status(400).json({
                      statusCode: 400,
                      message: `Something went wrong`,
                    });
                  } else {
                    res.status(200).json({ result: req.body });
                    return;
                  }
                }
              );
            } else {
              res.status(403).json({
                statusCode: 401,
                message: `Unauthorized`,
              });
            }
          } else {
            res.status(404).json({
              statusCode: 404,
              message: `Meal not found`,
            });
          }
        }
      );
    } else {
      res.status(400).json({
        statusCode: 400,
        message: `Not logged in`,
      });
    }
  },

  deleteMealById: (req, res) => {
    const mealId = req.params.mealId;
    if (typeof req.jwtUserId === "undefined") {
      res.status(400).json({
        statusCode: 400,
        message: `Not logged in`,
      });
    } else {
      Database.query(
        "SELECT cookId FROM meal WHERE id = ?; SELECT cookId FROM meal WHERE id = ? AND cookId = ?",
        [mealId, mealId, req.jwtUserId],
        (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              statusCode: 400,
              message: `Something went wrong`,
            });
          } else {
            if (rows[0].length == 0) {
              return res.status(404).json({
                statusCode: 404,
                message: `Meal does not exist`,
              });
            } else if (rows[1].length == 0) {
              return res.status(403).json({
                statusCode: 403,
                message: `Unauthorized`,
              });
            } else {
              Database.query(
                "DELETE FROM meal WHERE id = ?",
                [mealId],
                (err, rows, fields) => {
                  if (err) {
                    console.log(err);
                    res.status(400).json({
                      statusCode: 400,
                      message: `Something went wrong`,
                    });
                  } else {
                    res.status(200).json({
                      statusCode: 200,
                      message: `succesfully deleted meal`,
                    });
                  }
                }
              );
            }
          }
        }
      );
    }
  },

  enrollMeal: (req, res) => {
    const mealId = req.params.mealId;
    Database.query(
      "INSERT INTO `meal_participants_user` WHERE userId = ? AND mealId = ?",
      [userId, mealId],
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            statusCode: 400,
            message: `Something went wrong`,
          });
        } else {
          res.status(200).json({
            statusCode: 200,
            message: `succesfully enrolled into meal`,
          });
        }
      }
    );
  },
};

module.exports = controller;
