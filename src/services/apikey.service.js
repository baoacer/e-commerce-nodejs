'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')
/*
    Service: Quản lý các 'API KEY'
*/

/**
 * Find ApiKey && status = true 
 * @param {String} key - Được truyền từ headers 'x-api-key' && kiểm tra tồn tại trong database
 * @returns {Object}  - Đối tượng ApiKey
 */
const findById = async ( key ) => {
    // const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permisstions: ['0000']})
    // console.log(newKey)
    const objKey = await apikeyModel.findOne({ key, status: true }).lean()
    return objKey
}

module.exports = {
    findById
}
