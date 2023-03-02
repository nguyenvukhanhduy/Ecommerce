'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb+srv://ecommerce:23012000@cluster0.19m0zve.mongodb.net`

mongoose.connect(connectString).then( _ => console.log(`Connect Success`))
    .catch(err => console.log(`Error faild`))

//dev

if (1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose