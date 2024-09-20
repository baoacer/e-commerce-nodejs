require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// console.log(`Process:: `, process.env)
// init middlewares
app.use(morgan('dev')); // () -> (dev, short, *(product)common, tiny, combined) log
app.use(helmet()); // Ẩn thông tin header
app.use(compression()); // giảm băng thông (size data) trong req | res
app.use(express.json());
app.use(express.urlencoded({ 
    extended: true
 }));

// init database
require('./database/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init router
app.use('/', require('./routes/index'))

// handling error
module.exports = app