'use strict';

/*
    Triển khai connect tới database MongoDb
*/

const { default: mongoose } = require("mongoose");
const { countConnect } = require('../helpers/check.connect');
const { db: { host, port, name } } = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;

class Database{
    constructor(){
        this.connect();
    }

        connect(){
            if(1 === 1){
                mongoose.set('debug', true);
                mongoose.set('debug', {color: true});
            }
            mongoose.connect(connectString, {maxPoolSize: 50}).then(() => {
                console.log(`Connect Database Mongodb Successfully!::${name}`)
            }).catch((error) => {
                console.log(`Error Connect!: ${error}`)
            })
        }

    static getIntance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance
    }
}

const instanceMongoDb = Database.getIntance();
module.exports = instanceMongoDb