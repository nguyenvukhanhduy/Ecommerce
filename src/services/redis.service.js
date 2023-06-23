'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.redisClient()


const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)
//khoa lac quan
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTime = 10;
    const expireTime = 3000; // 3 seconds tam  lock

    for (let i = 0; i < retryTime.length; i++) {
        //tao mot key , user nao nam giu se duoc thanh toan
        const result = await setnxAsync(key, expireTime)
        console.log(`result:::`, result)
        if (result === 1) {
            //thao tac voi inventory
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReversation.modifiedCount) { // neu da thay doi so luong trong inventory 
                await pexpire(key, expireTime)
                return key
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}