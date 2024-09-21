"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
};

/* 
    Xử lý logic các method truy cập như signin, signup...
*/

class AccessService {

  /**
   * Login: Thành công tạo Access Token và Refresh Token
   * 
   * @param {String} email  
   * @param {String} password  
   * @param {String} refreshToken -   
   * @returns 
   */
  static login = async ({ email, password, refreshToken }) => {
    // 1 - check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // 2 - match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authenticated error");

    // 3 - create Access Token & Refresh Token
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
    
    // 4 - generate token 
    const tokens = await createTokenPair(
      { userId: foundShop._id },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      refreshToken: tokens.refreshToken
    })

    // 5 - get data return login 
    return {
      metadata: {
        shop: getInfoData({fields: ["_id", "name", "email"],object: foundShop}),
        tokens
      }
    };
  };

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

      console.log({ privateKey, publicKey }); 

      // Created Token Pair
      const tokens = await createTokenPair(
        { userId: newShop._id },
        publicKey,
        privateKey
      );
      console.log(`Create Token Successfully!::`, tokens);

     // Save token to Database
     await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        // refreshToken: tokens.refreshToken
      });

      return {
        code: 201,
        metadata: {
          shop: getInfoData({fields: ["_id", "name", "email"],object: newShop}),
          tokens
        }
      };
    }
  };
}

module.exports = AccessService;
