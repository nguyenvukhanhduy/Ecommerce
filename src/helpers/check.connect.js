'use strict'

//Kiểm tra số lượng connect của db
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections::${numConnection}`)
}

//check over load 
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length //Kiểm tra số lượng kết nối db
        const numberCores = os.cpus().length // kiểm tra core của CPU
        const memoryUsage = process.memoryUsage().rss // Lấy Memory đã sử dung
        // Example maximum number of connection based on number of cores 
        const maxConnections = numberCores * 5;

        console.log(`Active connections::${numConnection}`) // Thông báo số lượng kết nối db
        console.log(`Memory usage::${memoryUsage/ 1024 /1024} MB`)// Thông báo số lượng memory đã dùng 

        if(numConnection > maxConnections ){
            console.log(`connection overload detected`)
        }

    }, _SECOND)// Monitor every 5 seconds
}
module.exports = {
    countConnect,
    checkOverload
}