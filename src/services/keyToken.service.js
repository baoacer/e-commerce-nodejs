'use strict'

const keyTokenModel = require("../models/keyToken.model")

/*
    KeyTokenService: quản lý token 
*/

class KeyTokenService{

    /**
     * Tạo token mới cho người dùng.
     * 
     * @param {string} userId - ID của người dùng.
     * @param {string} publicKey - Được lưu trong database && giải mã privateKey
     * @returns {string|null} - Trả về publicKey nếu thành công, ngược lại trả về null.
     */
    static createKeyToken = async ( { userId, publicKey} ) => {
        try {
            const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })
            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService