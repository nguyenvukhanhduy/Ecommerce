'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')// Ma hoa password 
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',

}
class AccessService {
    /**
        check this token used?      
     */
    static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend!! Pls relogin')
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not Registered !!!')
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not Registered!!')
        //create 1 cap token moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi 
            }
        })
        return {
            user,
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken) => {
        //check xem token da dc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        //neu co
        if (foundToken) {
            //decode xem la ai co trong he thong khong?
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            //xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend!! Pls relogin')
        }
        //chua co
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not Registered !!!')
        //verify Token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', { userId, email })
        //check UserId
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not Registered!!')
        //create 1 cap token moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi 
            }
        })

        return {
            user: { userId, email },
            tokens
        }

    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }
    /*
        1. - check email in dbs
        2. - match password 
        3. - create AT vs RT  and save
        4. - genarate tokens
        5. - get data return login
    */

    static login = async ({ email, password, refreshToken = null }) => {

        //1.
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registered!!')

        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Error')

        //3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        //4.    
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // try {
        //step1: check email exists ??

        const holderShop = await shopModel.findOne({ email }).lean()
        //If email already
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        //Create new email
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            //save vao collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }

            //create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log('Creaete Token Success::', tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }), //using lodash npm
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }

}
module.exports = AccessService