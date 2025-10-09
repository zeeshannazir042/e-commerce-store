// Packages
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import categoryRoutes from './Routes/categoryRoutes.js';
import productRoutes from './Routes/ProductRoutes.js';
import uploadRoutes from './Routes/uploadRoutes.js';

// Utils
import connectDB from './Config/db.js';
import userRoutes from './Routes/userRouts.js';

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// API Routes FOR USERS
app.use("/api/users", userRoutes);
// API Routes FOR CATEGORY
app.use("/api/category", categoryRoutes);
// API ROUTES FOR PRODUCTS
app.use("/api/products", productRoutes);
// Make uploads
app.use('/api/uploads', uploadRoutes);
// Make the uploads folder publicly accessible
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
