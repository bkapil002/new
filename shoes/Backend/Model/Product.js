const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    currentPrice:{
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    // features: {
    //     cashOnDelivery: Boolean,
    //     lowestPrice: Boolean,
    //     sevenDayReturns: Boolean,
    //     freeDelivery:Boolean
    // },
    details:String
},{timestamps:true})

module.exports = mongoose.model('Product', productSchema);