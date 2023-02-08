const mongoose = require('mongoose');
const Product = require('../models/product');


// funcation to handle the get request  of all the products from the router  get request
exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id  productImage")
        .exec()
        .then(docs => {
            const response =
            {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request:
                        {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if (doc.length > 0)
            // {
            res.status(200).json(response);
            // }
            // else
            // {
            //     res.status(404).json({
            //         message: "No products found"
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                rror: err
            });
        })
};

// function to hnadle the create or update  a  product  from the router post request
exports.products_create_all = (req, res, next) => {
    console.Console(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                creatproduct:
                {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request:
                    {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err

            });
        })
};

// funcation to handle the get single product from the router get/id request .
exports.products_get = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        // .exexc()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(
                    {
                        product: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products'
                        }
                    });
            } else {
                res.status(404).json({
                    message: "Product not found"
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        })
};

exports.products_update =  (req, res, next) => {
    const id = req.params.productId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Product.updateMany({ _id: id }, { $set: req.body })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Updating Products",
                request:
                {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

};

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(
            res.status(200).json({
                message: "Deleting Products",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {
                        name: "String",
                        price: "Number"
                    }
                }
            })
        )
        .catch(err => {

            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};