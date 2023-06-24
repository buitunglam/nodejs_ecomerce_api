"use strict";

const JWT = require("jsonwebtoken");

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
      console.log("{ accessToken, refreshToken }..., ", {
        accessToken,
        refreshToken,
      });
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

module.exports = createTokenPair;
