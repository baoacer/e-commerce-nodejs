'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/async.handler');
const router = express.Router();

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
/* Xác thực người dùng trước khi thực hiện call api bên dưới */
router.use(authenticationV2)

// logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router
