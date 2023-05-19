'use strict'

const DiscountService = require("../services/discount.service")
const { SuccessResponse } = require('../core/success.response')

class DiscountController {
    createDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Discount Success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleteDiscountCode Successful',
            metadata: await DiscountService.deleteDiscountCode({
                ...req.body
            })
        }).send(res)
    }
}
module.exports = new DiscountController()