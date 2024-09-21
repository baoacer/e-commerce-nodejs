"use strict";

const { Create, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

/**
    AccessController xử lý các yêu cầu liên quan đến truy cập của người dùng.
 */
class AccessController {

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
