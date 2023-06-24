"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log("signup....", req.body);
      return res.status(201).json(await AccessService.signup(req.body));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = new AccessController();
