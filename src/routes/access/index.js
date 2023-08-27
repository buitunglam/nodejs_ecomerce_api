"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/signup", asynHandler(AccessController.signup));
router.post("/shop/login", asynHandler(AccessController.login));

// authetication
router.use(authentication);
// logout
router.post("/shop/logout", asynHandler(AccessController.logout));

module.exports = router;
