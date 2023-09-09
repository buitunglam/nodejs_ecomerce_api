"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/signup", asynHandler(AccessController.signup));
router.post("/shop/login", asynHandler(AccessController.login));

// authetication
router.use(authenticationV2);
// logout
router.post("/shop/logout", asynHandler(AccessController.logout));
router.post("/shop/refreshToken", asynHandler(AccessController.handleRefreshToken));

module.exports = router;
