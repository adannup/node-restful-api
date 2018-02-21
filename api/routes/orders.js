const express = require('express');
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');
const router = express.Router();

// Handle incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.route('/:orderId')
  .get(checkAuth, OrdersController.orders_get_order)
  .delete(checkAuth, OrdersController.orders_delete_order)

module.exports = router;
