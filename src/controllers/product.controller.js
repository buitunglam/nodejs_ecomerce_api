"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const ProductSerivce = require("../services/product.service");
const ProductSerivceV2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    // v1
    // new SuccessResponse({
    //   message: 'Create new product success!',
    //   metadata: await ProductSerivce.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   })
    // }).send(res)

    // v2
    new SuccessResponse({
      message: "Create new product success!",
      metadata: await ProductSerivceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
