"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      console.log("{ userId, publicKey, privateKey }....", { refreshToken });
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true }; // nếu như có new = true sẽ update. Nếu ko có sẽ tạo mới
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      console.log("tokens....", { tokens, filter, update, options });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeById = async (id) => {
    return await keyTokenModel.deleteOne({id})
  };
}

module.exports = KeyTokenService;
