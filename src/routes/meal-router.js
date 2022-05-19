const router = require("express").Router();
const {
  getAllMeals,
  getMealById,
  updateMealById,
  deleteMealById,
  addMeal,
} = require("../controllers/meal-controller");

const { validateToken } = require("../controllers/auth-controller");

router.get("/", getAllMeals);

router.get("/:mealId",  getMealById);

router.post("/", validateToken, addMeal);

router.put("/:mealId", validateToken, updateMealById);

router.delete("/:mealId", validateToken, deleteMealById);

module.exports = router;
