"use strict";

const { Create } = require("../core/success.response");
const AccessService = require("../services/access.service");

/**
    AccessController xử lý các yêu cầu liên quan đến truy cập của người dùng.
 */
class AccessController {
  signUp = async (req, res, next) => {
    new Create({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  };
}

module.exports = new AccessController();
