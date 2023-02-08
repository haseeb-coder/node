// This is schema files where we define the schmea for the database

const mongoose = require('mongoose');

const  productSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    //  Adding configuration for the input of the price 
    // 
    price:{type: Number,required: true},
    productImage:{type: String,required: true},
});

module.exports = mongoose.model('Product', productSchema)