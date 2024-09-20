"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
};

/* 
    Xử lý logic các method truy cập như signin, signup...
*/

class AccessService {

  /*
    1 check exitst email
    2 match password
    3 create access token & refresh token
    4 create token
    5 return login data
   */
  static login = async ({ email, password, refreshToken }) => {
    
  }

  static signUp = async ({ name, email, password }) => {
    //Step1: check email exists?
    const existShop = await shopModel.findOne({ email }).lean();
    if (existShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: RoleShop.SHOP,
    });

    if (newShop) {
      // create privateKey(user), publicKey(database): verify token
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey }); // save collection TokenStore

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: publicKeyString error!");
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      // Created Token Pair
      const tokens = await createTokenPair(
        { userId: newShop._id },
        publicKeyObject,
        privateKey
      );
      console.log(`Create Token Successfully!::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
        status: "Successfully!",
      };
    }
  };
}

module.exports = AccessService;
