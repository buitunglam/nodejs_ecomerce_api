"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// authetication
router.use(authenticationV2);
// logout
router.post("", asynHandler(ProductController.createProduct));

module.exports = router;
