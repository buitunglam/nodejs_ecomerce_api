"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logout = async (req, res, next) => {
    console.log("req.keyStore///", {keyStore: req.keyStore});
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
  signup = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signup(req.body));
    return new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };
}

module.exports = new AccessController();
