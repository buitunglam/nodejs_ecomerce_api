"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbidenError,
} = require("../core/error.response");
const { findEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    //step1: check mail exist
    /**
     * use lean will return pure object javascript so it will reduce size of reponse
     **/
    const holderShop = await shopModel.findOne({ email }).lean();
    console.log("holderShop...", holderShop);
    if (holderShop) {
      // return {
      //   code: "xxx",
      //   message: "Shop is already registed!",
      // };
      throw new BadRequestError("Error: Shop is already registed!");
    }

    // hash passwrod
    /** bcrypt should choose 10 would be nice. you can choose more to make more complicated but machine will have bump more and it cause lake memory  */
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      role: [RoleShop.SHOP],
    });
    if (newShop) {
      // create privateKey, publicKey crypto nó sẽ gen dựa vào thuật toán bất đối xứng
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // save public key and user id to db
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "publicKeyString error",
        };
      }
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  /*
    1. check email in dbs
    2. match password
    3. create access token and refresh token and save
    4. generate tokens
    5. get data return login
  */

  static login = async ({ email, password, refreshToken = null }) => {
    // 1.check email
    const foundShop = await findEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registerd");
    // 2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");
    //3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //4.
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    const { _id: userId } = foundShop;
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    // 5.
    return {
      code: 200,
      metadata: {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeById(keyStore._id);
    console.log("delkey....", delKey);
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUse(
      refreshToken
    );
    // Check xem token này đã được sử dụng hay chưa
    // Nếu có
    if (foundToken) {
      // decode xem mày là thằng nào
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      // xoa tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbidenError("Something went wrong happend. Please relogin!");
    }
    // Nếu chưa
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    console.log("holderToken...", holderToken);
    if (!holderToken) throw new AuthFailureError("Shop is not registerd");
    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("verify...", { userId, email });
    // check userId
    const foundShop = await findEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed");
    // cấp 1 cặp key mới
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    // Update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    console.log("keyStore.....", {keyStore, refreshToken});
    if(keyStore.refreshTokensUsed.includes(refreshToken)){
      // xoa tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbidenError("Something went wrong happend. Please relogin!");
    }

    if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop is not registerd");

    // check userId
    const foundShop = await findEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed");
    // cấp 1 cặp key mới
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    console.log("tokens...", keyStore);
    // Update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    console.log("updateOne...", keyStore);
    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
