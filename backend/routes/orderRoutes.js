const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Place a new order
router.post('/orders', async (req, res) => {
  const { recipientName, address, phoneNumber, cart } = req.body;
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  try {
    const newOrder = new Order({
      recipientName,
      address,
      phoneNumber,
      cart,
      totalPrice
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Lấy danh sách đơn hàng
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Lấy đơn hàng theo ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Cập nhật đơn hàng
router.put('/orders/:id', async (req, res) => {
  const { recipientName, address, phoneNumber, cart } = req.body;
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.recipientName = recipientName;
    order.address = address;
    order.phoneNumber = phoneNumber;
    order.cart = cart;
    order.totalPrice = totalPrice;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Xóa đơn hàng
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
