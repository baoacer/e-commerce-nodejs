const JWT = require('jsonwebtoken');


/**
 * Tạo cặp token (AccessToken và RefreshToken) từ payload.
 *
 * @param {Object} payload - Dữ liệu cần mã hóa trong token.
 * @param {string} publicKey - Khóa công khai để xác thực token.
 * @param {string} privateKey - Khóa riêng để ký token.
 * @returns {Promise<Object>} - Một promise trả về đối tượng chứa accessToken và refreshToken.
 */
const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        //AccessToken
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

module.exports = {
    createTokenPair
}