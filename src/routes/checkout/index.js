"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout\u001D.controller");
const router = express.Router();


// get amount
router.post("/review", asynHandler(checkoutController.checkoutReview));


module.exports = router;
