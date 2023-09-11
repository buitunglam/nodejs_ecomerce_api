"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("req.....", req.user);
    new SuccessResponse({
      message: 'Create new product success!',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId 
      })
    }).send(res)
  }
  
}

module.exports = new ProductController();
