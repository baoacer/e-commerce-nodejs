'use strict'

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')


class SuccessResponse {
    constructor({message, status = StatusCodes.OK, metadata = {}}){
        this.message = !message ? ReasonPhrases.OK : message
        this.status = status
        this.metadata = metadata
    }

    send(res, headers = {}){
        return res.status(this.status).json(this)
    }
}

class Ok extends SuccessResponse {
    constructor({message, metadata}){
        super({message, metadata})
    }
} 

class Create extends SuccessResponse{
    constructor({message = ReasonPhrases.CREATED, status = StatusCodes.CREATED, metadata}){
        super({message, status, metadata})
    }
}

module.exports = {
    Ok,
    Create,
    SuccessResponse
}

