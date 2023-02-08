const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    //  here we have to check in the database if the user email is already registered if not already registered then create
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {

            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User already exists'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {

                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            // we should have to encrypt the pasword from any hacking so that we use the package that is bcrypt
                            password: hash
                        });
                        user.save()
                            .then((result) => {
                                res.status(201).json({
                                    message: 'User created successfully',
                                    user: result
                                })

                            }).catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })

                            });

                    }
                });

            }

        })

};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'Authentication failed'
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });

                }
                if (result) {
                    // adding java scrpit web token  method for the signup process 
                   const token = jwt.sign({
                        email: user[0].email,
                        userId:user[0]._id
                    },
                     process.env.JWT_KEY,
                    {   //javascript object

                        expiresIn: '1h' // itexpeirse duration for security check
                    }
                    
                    );

                    res.status(200).json({
                        message: 'User logged in successfully',
                        token: token //json token returned 

                    });
                }
                res.status(401).json({
                    message: 'Authentication failed'
                });
            });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};


exports.user_delete = (req, res, next) => {

    User.remove({
        _id: req.params.userId,
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted successfully'
            })
        })
        .catch(
            (err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
        )

};