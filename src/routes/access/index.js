"use strict";

const express = require("express");
const AccessController = require("../../controllers/Access.controller");
const router = express.Router();

router.post("/shop/signup", AccessController.signup);

module.exports = router;
