"use strict";

const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signup(req.body));
    return new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };
}

module.exports = new AccessController();
