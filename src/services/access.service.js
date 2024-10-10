"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  NotFoundError,
  AuthFailureError,
  FobiddenError,
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
   * Fix v2
   * Kiểm tra và cấp lại Token nếu refreshToken hợp lệ 
   */
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user
    if(keyStore.refreshTokensUsed.includes(refreshToken)){
      await KeyTokenService.deleteKeyById(userId)
      throw new FobiddenError('Something wrong happend !! pls relogin')
    }
    
    if(keyStore.refreshToken !== refreshToken) 
      throw new AuthFailureError('Shop not register 1')

    const foundShop = await findByEmail({ email })
    if(!foundShop) throw new AuthFailureError('Shop not register 2')

      // 6 - create new token
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
    
    // 6.1 - generate token 
    const tokens = await createTokenPair(
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    // 7 - update Token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return{
      user,
      tokens
    }
  };

  /**
   * Kiểm tra và cấp lại Token nếu refreshToken hợp lệ 
   * Trường hợp bị bên thứ 3 biết token -> hacker sử dụng token -> tồn tại trong         refreshTokensUsed -> xóa token và yêu cầu relogin
   */
  static handlerRefreshToken = async (refreshToken) => {
    
    // 1 - Kiểm tra refreshToken đã tồn tại trong refreshTokensUsed
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

    // 2 - Nếu tồn tại ( nguy hiểm ) -> xóa Token trong dbs và xuất error
    if(foundToken){
      const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey)
      console.log({ userId, email })
      await KeyTokenService.deleteKeyById(userId)
      throw new FobiddenError('Something wrong happend !! pls relogin')
    }

    // 3 - Kiểm tra refreshToken trong db
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if(!holderToken){
      throw new AuthFailureError('Shop not register 1')
    }

    // 4 - verify Token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)

    // 5 - check userId
    const foundShop = await findByEmail({ email })
    if(!foundShop) throw new AuthFailureError('Shop not register 2')

    // 6 - create new token
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
    
    // 6.1 - generate token 
    const tokens = await createTokenPair(
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    // 7 - update Token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return{
      user: {userId, email},
      tokens
    }
  };


  /**
   * Xóa cặp 'Token' được lưu trong dbs
   * 
   * @param {*} keyStore - Được gán vào req.keyStore khi qua authentication 
   * @returns 
   */
  static logout = async ( keyStore ) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(`DelKey::`, { delKey })
    return delKey
  }

  /**
   * Login: Thành công tạo Access Token và Refresh Token
   * 
   * @param {String} email  
   * @param {String} password  
   * @param {String} refreshToken 
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
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    // 5 - create & save keyToken to dbs
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      refreshToken: tokens.refreshToken
    })

    // 6 - get data return login 
    return {
      metadata: {
        shop: getInfoData({fields: ["_id", "name", "email"],object: foundShop}),
        tokens
      }
    };
  };


/**
 * 
 * @param {*} param0 
 * @returns 
 */
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
