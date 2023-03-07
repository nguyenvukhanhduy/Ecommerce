require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet, crossOriginResourcePolicy } = require('helmet')
const compression = require('compression')
const app = express()
//init middleware
app.use(morgan("dev")) // edit response 
app.use(helmet()) // mã hoá api 
app.use(compression()) // giảm tải dữ liệu
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//jnit db
require('./dbs/init.mongodb')
// const {checkOverload} = require( './helpers/check.connect')
// checkOverload()
//init router  
app.use('/', require('./routes'))

//handle error

module.exports = app;
