"use strict";

const express = require("express");
const AccessController = require("../../controllers/Access.controller");
const {asynHandler} = require("../../auth/checkAuth")
const router = express.Router();

router.post("/shop/signup", asynHandler(AccessController.signup));

module.exports = router;
