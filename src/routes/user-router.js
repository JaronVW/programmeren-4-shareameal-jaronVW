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

router.get("/:userId",validateToken, getUserById);

router.put("/:userId", validateToken, validateUser, editUser);

router.delete("/:userId", validateToken, deleteUser);

router.get("/", validateToken, getUsers);





module.exports = router;
