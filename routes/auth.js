const express = require("express");
const router = express.Router();
// /api/v1/auth/login
// /api/v1/auth/register
const { login, register } = require("../controllers/auth");
router.post("/register", register);
router.post("/login", login);
module.exports = router;
