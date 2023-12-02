const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const productRouter = require("./product");
const discountRouter = require("./discount");
const checkoutRouter = require("./checkout");
const cartRouter = require("./cart");
const { apiKey, permissions } = require("../auth/checkAuth");

router.use(apiKey);
// check permission
router.use(permissions("0000"));
router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/checkout", checkoutRouter);
router.use("/v1/api/cart", cartRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api", accessRouter);

module.exports = router;
