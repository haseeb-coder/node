const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

// handling the incoming request for get all orders.
router.get('/', checkAuth, OrdersController.orders_get_all);

//  Handling the request to create a new order.
router.post('/', checkAuth, OrdersController.orders_create_all);

// Handling the request to get asingle order
router.get('/:ordersId', checkAuth, OrdersController.orders_get_order);

// Handling the request to delete a single order
router.delete('/:ordersId',checkAuth,   OrdersController.orders_delete_order);

module.exports = router;