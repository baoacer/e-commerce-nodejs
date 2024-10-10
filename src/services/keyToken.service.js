'use strict'

const keyTokenModel = require("../models/keyToken.model")
const { Types } = require('mongoose')

/*
    KeyTokenService: quản lý token của user
*/

class KeyTokenService{

    /**
     * Tạo token mới cho người dùng & luư trong database
     * 
     * @param {string} userId - ID của người dùng.
     * @param {string} publicKey - Được lưu trong database && sử dụng giải mã privateKey
     * @returns {string|null} - Trả về publicKey nếu thành công, ngược lại trả về null.
     */
    static createKeyToken = async ( { userId, publicKey, refreshToken } ) => {
        try {
            /**
             * Level 0
             * 
                const publicKeyString = publicKey.toString()
                const tokens = await keyTokenModel.create({
                    user: userId,
                    publicKey: publicKeyString,
                })
            */
   
            /**
             * level xxx
             * 
             * @param {Object} filter - document mà mongodb findOne()
             * @param {Object} update - các field được cập nhập nếu tìm thấy document hợp lệ
             * @param {Object} options -  upsert: true -> nếu không tìm thấy -> tạo document với field trong update
             *                            new: true -> nếu tìm thấy -> update
             */
            const filter = { user: userId },
                update = { publicKey: publicKey.toString(), refreshTokensUsed: [], refreshToken },
                options = { upsert: true, new: true } 

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? publicKey : null
        } catch (error) {
            return error
        }
    }

    /**
     * Tìm token theo userId
     * 
     * @param {*} userId 
     * @returns 
     */
    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(String(userId)) })
    }

    /**
     * Xóa token theo keyId
     * 
     * @param {*} keyId 
     * @returns 
     */
    static removeKeyById = async ( keyId ) => {
        const resutl = await keyTokenModel.deleteOne({ _id: new Types.ObjectId(String(keyId)) }).lean()
        return resutl;
    }

    /**
     * Tìm kiếm refreshToken trong refreshTokensUsed
     * 
     * @param {*} refreshToken 
     * @returns 
     */
    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    /**
     * Tìm kiếm refreshToken
     * 
     * @param {*} refreshToken 
     * @returns 
     */
    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken })
    }

    /**
     * Xóa token theo userId
     * 
     * @param {*} userId 
     * @returns 
     */
    static deleteKeyById = async ( userId ) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(String(userId)) }).lean()
    }
}

module.exports = KeyTokenService