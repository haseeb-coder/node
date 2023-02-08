const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')

        // if you want to to fetch all the products from the order we   will use the populate function to fetch all the products.
        // in the first place we will writte the name of the ref field and then the the related product name or any thing else.
        .populate('product', 'name')
        .then((docs) => {

            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request:
                        {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });

        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create_all = (req, res, next) => {
    // Adding logic for the products that the quantity of only those products saved that are have product id only.
    Product.findById(req.body.productId)
        .then(products => {
            if (!products) {
                return res.status(404).json({
                    error: "product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.product,
            });
            return order.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "order created and added successfully or stored successfully",
                createOrder:

                {
                    _id: result._id,
                    productId: result.product,
                    quantity: result.quantity,

                },
                request:
                {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });

        });
};

exports.orders_get_order =  (req,res, next) =>{
    Order.findById(req.params.ordersId)
    .populate('product')
    .exec()
    .then(order =>{
        if (!order){
            return res.status(404).json({
                error: "order not found"
            });
        }
            res.status(200).json({
                order: order,
                request:
                {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + req.params.ordersId
                }

            })
        }
    )
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
    
};

exports.orders_delete_order = (req,res, next) =>{

    Order.remove({
        _id: req.params.ordersId
    })
    .exec()
    .then( result =>
        {
            res.status(200).json({
                message:"order deleted successfully",
                request:
                {
                    type: 'DELETE',
                    url: 'http://localhost:3000/orders',
                    body:
                    {
                        productId: "ID",
                        quantity: "Number"
                    
                    }
                }
             })
            })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

};
