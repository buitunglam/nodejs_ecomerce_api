"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  /**
   * @desc add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {}
   */

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add cart success!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart success!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart success!",
      metadata: await CartService.getlistUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
