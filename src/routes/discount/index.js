"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();


// get amount
router.post("/amount", asynHandler(discountController.getDiscountAmount));
router.get("/list_product_code", asynHandler(discountController.getAllDiscountCodesWithProducts));

// authetication
router.use(authenticationV2);
// logout
router.post("", asynHandler(discountController.createDiscountCode));
router.get("", asynHandler(discountController.getAllDiscountCode));

module.exports = router;
