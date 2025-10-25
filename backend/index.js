// Packages
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routes
import categoryRoutes from './Routes/categoryRoutes.js';
import productRoutes from './Routes/ProductRoutes.js';
import uploadRoutes from './Routes/uploadRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import userRoutes from './Routes/userRouts.js';

// Utils
import connectDB from './Config/db.js';

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Make uploads folder publicly accessible
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PAYPAL Config Route
app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
