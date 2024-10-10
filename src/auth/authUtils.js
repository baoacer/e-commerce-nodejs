const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/async.handler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

/**
 * Tạo cặp token (AccessToken và RefreshToken) từ payload.
 *
 * @param {Object} payload - Dữ liệu cần mã hóa trong token.
 * @param {string} publicKey - Khóa công khai để xác thực token được lưu trong dbs
 * @param {string} privateKey - Khóa riêng để ký token.
 * @returns {Promise<Object>} - Một promise trả về đối tượng chứa accessToken và refreshToken.
 */
const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // AccessToken
        const accessToken = await JWT.sign(payload, privateKey, {   
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log(`error::`, err)
            }
            console.log(`decode::`, decoded)
        })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Middleware (access : index.js) authentication
 * Xác thực token trước khi cho phép thực hiện các request
 */
const authentication = asyncHandler(async (req, res, next) => {
    // 1 - check userId missing?
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid request')

    // 2 - get accessToken
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    // 3 - get accessToken from headers (authorization)
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid request')

    // 4 - verify accessToken
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    // 1 - check userId missing?
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid request')

    // 2 - get accessToken
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    // 3 - get refreshToken from headers (authorization)
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    } 

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid request')
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async ( token, keySecret ) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}