const router = require("express").Router();
const { login, validateLogin } = require("../controllers/auth.controller");

router.post("/login", validateLogin, login);

module.exports = router;
