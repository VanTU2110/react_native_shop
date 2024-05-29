const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/auth');
const app = express();
const port = 5000;

// Kết nối tới MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase';
mongoose.connect(mongoURI)
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch((error) => console.error('Kết nối MongoDB thất bại:', error));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Router định tuyen.
// trước kia chỉ có api. Thì khi mình trỏ /api/products.
// thì /api -> productRoutes -> gọi tới uri /products trong productRoutes
// hiện tại /api/product -> gọi tới uri /products trong productRoutes
// =>> /api/product/products.
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);

// /api/order/orders
app.use('/api/order', orderRoutes);

// /api/auth/register
app.use('/api/auth', authRoutes);


// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
