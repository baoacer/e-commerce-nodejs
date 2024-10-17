'use strict'

const _ = require('lodash')


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


/**
 * 
 * @desc Convert array to object. 
 * ['a', 'b'] => { a: 1, b: 1 } 
 */
const getSelectData = ( select = [] ) => {
    return Object.fromEntries(select.map(item => [item, 1]))
}

// ['a', 'b'] => { a: 0, b: 0 } 
const unGetSelectData = ( select = [] ) => {
    return Object.fromEntries(select.map(item => [item, 0]))
}

const removeUndifineObject = (obj) => {
    Object.keys(obj).forEach( key => {
        if(obj[key] === null || obj[key] === undefined)
             delete obj[key]
    })
    return obj
}

/**
 * const a = {
        c: {
            d: 1
            e: 2
        }
    }

    db.collection.updateOne({
        'c.d': 1
        'c.e': 2
    })
 * 
 */
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach( k => {
        if( typeof obj[k] === 'object' && !Array.isArray(obj[k]) ) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = response[a]
            })
        }else{
            final[k] = obj[k]
        }
    })

    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndifineObject,
    updateNestedObjectParser
}