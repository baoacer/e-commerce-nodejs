'use strict'

const _ = require('lodash')


/*
    Response Data
    getInfoData: Hàm lấy thông tin từ một đối tượng dựa trên các trường đã chỉ định.
*/


/**
 * Lấy thông tin từ một đối tượng theo các trường cụ thể.
 * 
 * @param {Object} param0 - Đối tượng chứa các tham số.
 * @param {Array} fields - Mảng các trường cần lấy từ đối tượng.
 * @param {Object} object - Đối tượng nguồn để lấy thông tin.
 * @returns {Object} - Đối tượng mới chỉ chứa các trường đã chỉ định.
 */
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfoData
}