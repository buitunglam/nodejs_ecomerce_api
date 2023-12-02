"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CheckouttService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new discount success!",
      metadata: await CheckouttService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
