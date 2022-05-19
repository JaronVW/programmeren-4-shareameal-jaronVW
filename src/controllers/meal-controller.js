const Database = require("../db");
const assert = require("assert");

const controller = {
  getAllMeals: (req, res) => {
    Database.query("SELECT * FROM meal", (err, rows, fields) => {
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

  getMealById: (req, res) => {
    const mealId = req.params.mealId;
    Database.query(
      "SELECT * FROM meal WHERE id = ?",
      [mealId],
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            Status: 400,
            Message: `Something went wrong`,
          });
        } else {
          if (rows.length == 0) {
            res.status(404).json({
              Status: 404,
              Message: `Meal not found`,
            });
          } else {
            res.send(rows);
          }
        }
      }
    );
  },

  addMeal: (req, res) => {
    const meal = req.body;
    
    Database.query(
      "INSERT INTO `meal`(`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `createDate`, `updateDate`, `name`, `description`) VALUES ('?,?,?,?,?,?,?,?,?,?,?,?,?,?') ",
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
        new Date().toISOString(),
        new Date().toISOString(),
        meal.name,
        meal.description,
        // meal.allergenes,
      ],
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
  },

  updateMealById: (req, res) => {
    const mealId = req.params.mealId;
    Database.query(
      "SELECT * FROM meal WHERE id = ?",
      [mealId],
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
  },

  deleteMealById: (req, res) => {
    const mealId = req.params.mealId;
    Database.query(
      "DELETE FROM meal WHERE id = ?",
      [mealId],
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            Status: 400,
            Message: `Something went wrong`,
          });
        } else {
          res.status(200).json({
            Status: 200,
            Message: `succesfully deleted meal`,
          });
        }
      }
    );
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
            Status: 400,
            Message: `Something went wrong`,
          });
        } else {
          res.status(200).json({
            Status: 200,
            Message: `succesfully enrolled into meal`,
          });
        }
      }
    );
  },
};

module.exports = controller;
