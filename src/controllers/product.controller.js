'use strict'

const { ProductFactoryV2 } = require("../services/product.servicev2")
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {

        // new SuccessResponse({
        //     message: 'Create new Product success',
        //     metadata: await ProductFactory.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)

        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //update Product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'UpdateProduct success',
            metadata: await ProductFactoryV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' publishProductByShop success',
            metadata: await ProductFactoryV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' unPublishProductByShop success',
            metadata: await ProductFactoryV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    //Query
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return{JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Drafts success!',
            metadata: await ProductFactoryV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success!',
            metadata: await ProductFactoryV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Search Product!',
            metadata: await ProductFactoryV2.searchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts Product!',
            metadata: await ProductFactoryV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct Product!',
            metadata: await ProductFactoryV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
    //End query
}
module.exports = new ProductController()