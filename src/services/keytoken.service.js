"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
const shopModel = require("../models/shop.model");
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
      const tokens = await keyTokenModel
        .findOneAndUpdate(filter, update, options)
        .lean();
      console.log("tokens....", { tokens, filter, update, options });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  // remve when logout
  static removeById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };

  static findByRefreshTokenUse = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  // remove when refresh token
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  };
}

module.exports = KeyTokenService;
