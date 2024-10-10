"use strict";

const { Create, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

/**
    AccessController xử lý các yêu cầu liên quan đến truy cập của người dùng.
 */
class AccessController {
  // handlerRefreshToken = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'Get Token OK!',
  //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
  //   }).send(res)

  // v2 fixed
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Token OK!',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout OK!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login OK!',
      metadata: await AccessService.login(req.body)
    }).send(res)
  };

  signUp = async (req, res, next) => {
    new Create({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  };
}

module.exports = new AccessController();
