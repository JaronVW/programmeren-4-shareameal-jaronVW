const router = require("express").Router();

const { validateToken } = require("../controllers/auth-controller");
const {
  addUser,
  getUserById,
  editUser,
  deleteUser,
  getUserProfile,
  getUsers,
  validateUser,
} = require("../controllers/user-controller");

router.post("/", validateUser, addUser);

router.get("/profile", validateToken, getUserProfile);

router.get("/:userId", getUserById);

router.put("/:userId", validateToken, validateUser, editUser);

router.delete("/:userId", deleteUser);

router.get("/", getUsers);





module.exports = router;
