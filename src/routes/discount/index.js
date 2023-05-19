'use strict'

const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authenticationV2} = require('../../auth/authUtils')

// get amount a discount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts))

//authentication
router.use(authenticationV2)

router.post('',asyncHandler(DiscountController.createDiscountCodes))
router.get('',asyncHandler(DiscountController.getAllDiscountCodes))
router.delete('/delete',asyncHandler(DiscountController.deleteDiscountCode))


module.exports = router