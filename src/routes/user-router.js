const router = require("express").Router();
const controller = require("../controllers/user-controller")


router.post("/", controller.addUser);

router.get("/:userId", controller.getUserById);

router.put("/:userId", controller.editUser);

router.delete("/:userId", controller.deleteUser);

router.get("/", controller.getUsers);

router.get("/profile", controller.getUserProfile);

module.exports = router;
