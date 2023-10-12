"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();


// get amount
router.get("", asynHandler(cartController.listToCart));
router.post("", asynHandler(cartController.addToCart));
router.post("/update", asynHandler(cartController.updateCart));
router.delete("", asynHandler(cartController.deleteCart));



module.exports = router;
