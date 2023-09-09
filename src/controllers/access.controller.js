"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // // handle for v1
    // new SuccessResponse({
    //   message: "Get token success!",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    // }).send(res)
    // handle v2
    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);;
    console.log("user controller....", {
      user: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      })
    });
  };

  logout = async (req, res, next) => {
    console.log("req.keyStore///", { keyStore: req.keyStore });
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signup = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signup(req.body));
    return new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
