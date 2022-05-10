const router = require("express").Router();

const { body, validationResult } = require('express-validator');
const { addUser, getUserById, editUser, deleteUser, getUserProfile, getUsers, validateUser } = require("../controllers/user-controller");

router.post("/", validateUser, addUser);

router.get("/:userId", getUserById);

router.put("/:userId", editUser);

router.delete("/:userId", deleteUser);

router.get("/", getUsers);

router.get("/login", getUserProfile);

module.exports = router;
