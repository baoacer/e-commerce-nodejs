const JWT = require('jsonwebtoken');

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