"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const { asynHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

// get list is not authen 
router.get("/search/:keySearch", asynHandler(ProductController.getListSearch));
router.get("", asynHandler(ProductController.findAllProducts));
router.get("/:product_id", asynHandler(ProductController.findProduct));


// authetication
router.use(authenticationV2);
// create product
router.post("", asynHandler(ProductController.createProduct));
router.patch("/:productId", asynHandler(ProductController.updateProduct));
router.post("/publish/:id", asynHandler(ProductController.publishProduct));
router.post("/unPublish/:id", asynHandler(ProductController.unPublishProduct));
// get all draft shop
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForshop))
router.get("/published/all", asyncHandler(ProductController.getAllPublishForshop))

module.exports = router;
