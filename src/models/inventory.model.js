'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
    inven_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    inven_location: {
        type: String,
        default: 'unknow'
    },
    inven_stock: {
        type: Number,
        required: true
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    //đặt hàng trước: 
    /*
    Là một thông lệ phổ biến để thiết lập trước trong collection hàng tồn kho khi người dùng
    đặt một sản phẩm
    Việc lưu trữ đặt trước giúp ngăn ngừa lỗi hàng tồn kho và đảm bảo khách hàng nhận được sản phẩm
    mà họ đã đặt
    Chúng ta kiểm tra nếu họ đặt hàng trong kho còn thì khi thanh toán chúng ta trừ đi số lượng đặt hàng
    */
    inven_reservations: {
        type: Array,
        default: []
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}