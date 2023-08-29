"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keytoken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify
    await JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("worng access token");
      } else {
        console.log("decode access token", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userID missing
    2 - Get accesstoken
    3 - verify token 
    4 - check user dbs
    5 - check keystore  with this userId
    6 - OK all => return next 
  */

  // 1.
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthFailureError("invalid Request");
  // 2. check toke exist in db
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");

  // 3.
  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  // 4,5,6
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId) throw new AuthFailureError("Invalid User");
    console.log("decodeUser...", keyStore);
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log("...error...", error);
    throw error;
  }
});

const verifyJWT = async (token, keySecrete) => {
  return JWT.verify(token, keySecrete)
}

module.exports = { createTokenPair, authentication, verifyJWT };
