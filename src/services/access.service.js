"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadResquestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    // try {
      //step1: check mail exist
      /**
       * use lean will return pure object javascript so it will reduce size of reponse
       **/
      const holderShop = await shopModel.findOne({ email }).lean();
      console.log('holderShop...', holderShop);
      if (holderShop) {
        // return {
        //   code: "xxx",
        //   message: "Shop is already registed!",
        // };
        throw new BadResquestError("Error: Shop is already registed!");
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
        console.log("tokens....", tokens);
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
    // } catch (error) {
    //   return {
    //     status: "error",
    //     code: "123",
    //     message: error.message,
    //   };
    // }
  };
}

module.exports = AccessService;
