// This is schema files where we define the schmea for the database

const mongoose = require('mongoose');

const  orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    // we need to create a relationship between the prduct and the orders
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
    quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model('Order', orderSchema);