'use strict'

const AccessService = require('../services/access.service')

/*
    Controller: Quản lý các Rest truy cập signin, signup...
*/
class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            return res.status(201).json(await AccessService.signUp(req.body));
        } catch (error) {
            console.log(`Error:: ${error}`)
        }
    }
}

module.exports = new AccessController()