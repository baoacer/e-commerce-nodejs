'use strict';
/*
    Kiểm tra số lượng connnect tới database mongodb
    * Sử dụng khi health check, check khi hệ thống quá tải...
*/

const { default: mongoose } = require("mongoose");
const os = require('os');
const process = require('process');
const _SECOND = 5000;
// Count Connect
const countConnect = () => {
    const countConnect = mongoose.connections.length;    
    console.log(`Count Connect::${countConnect}`);
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Giả sử mỗi core tải được 5 connection
        const maxConnections = numCores * 5;

        console.log(`Active connections::${numConnections}`)
        console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`)

        if(numConnections > maxConnections){
            console.log(`Connection overload deteded!`)
        }

    }, _SECOND); // Moniter every 5 second
}

module.exports = {
    countConnect,
    checkOverload
}
