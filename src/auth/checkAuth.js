'use strict'

const { findById } = require("../services/apikey.service")

// defined header use, trong đó 'x-api-key' được dùng để truyền API key
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

/*
    - Middleware để kiểm tra API key có trong request header hay không
    - Middleware này sẽ chặn các yêu cầu không hợp lệ nếu không có API key hợp lệ
*/

/**
 * @param {Object} req - Request object từ client
 * @param {Object} res - Response object để gửi phản hồi tới client
 * @param {Function} next - Hàm callback để tiếp tục xử lý các middleware khác hoặc function tiếp theo
 * @returns {Object} - Trả về response lỗi 403 nếu API key không hợp lệ hoặc tiếp tục sang middleware khác
 */
const apiKey = async (req, res, next) => {
    try {
        // Check exitst `apikey` in header
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // Check exitst `apikey` in database
        const objKey = await findById(key) 
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey // Add new attribute objKey to req
        return next() // Continue to middlware || function 
    } catch (error) {
        console.error(error)
    }
}

const permission = (permission) => (req, res, next) => {
    if (!req.objKey?.permisstions) {
        return res.status(403).json({ message: 'Forbidden Error' });
    }

    console.log(`Permissions::`, req.objKey.permisstions);
    if (!req.objKey.permisstions.includes(permission)) {
        return res.status(403).json({ message: 'Permission denied' });
    }
    next();
};

module.exports = {
    apiKey, permission
}