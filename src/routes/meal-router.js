const router = require("express").Router();
const {
  getAllMeals,
  getMealById,
  updateMealById,
  deleteMealById,
  addMeal,
  validateMeal,
} = require("../controllers/meal-controller");

const { validateToken } = require("../controllers/auth-controller");

router.get("/", validateToken, getAllMeals);

router.get("/:mealId", validateToken,  getMealById);

router.post("/", validateToken, validateMeal, addMeal);

router.put("/:mealId", validateToken, updateMealById);

router.delete("/:mealId", validateToken, deleteMealById);



module.exports = router;
