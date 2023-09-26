"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const ProductSerivce = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

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
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // PUT
  // publish product
  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success!",
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product success!",
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
  //END PUT

  // unpublish product
  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Un publish product success!",
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY
  /**
   * @desc Get all draft for shop
   * @param {number} limit
   * @return {JOSON} res
   */
  getAllDraftsForshop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductServiceV2.findAllDraftsForshop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForshop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list publish success!",
      metadata: await ProductServiceV2.findAllPublishForshop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearch = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success!",
      metadata: await ProductServiceV2.searchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list all product success!",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product success!",
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY
}

module.exports = new ProductController();
