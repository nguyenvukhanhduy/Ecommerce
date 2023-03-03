require ('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet, crossOriginResourcePolicy } = require('helmet')
const compression = require ('compression')
const app = express()
//init middleware
app.use(morgan("dev")) // edit response 
app.use(helmet()) // mã hoá api 
app.use(compression()) // giảm tải dữ liệu

//jnit db
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
//init router  
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'hello',
    })
})

//handle error

module.exports = app;
