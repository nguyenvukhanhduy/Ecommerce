'use strict'

// level0

// const config = {
//     app: {
//         port:3000
//     },
//     db: {
//         host: 'ecommerce:23012000@cluster0.19m0zve.mongodb.net'
//     }
// };

//level 1 
const dev = {
    app: {
        port: process.env.DEV_APP_PORT 
    },
    db: {
        host: process.env.DEV_DB_HOST 
    }
};

// const pro = {
//     app: {
//         port: process.env.PRO_APP_PORT 
//     },
//     db: {
//         host: process.env.PRO_DB_HOST
//     }
// };
const config = { dev}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]