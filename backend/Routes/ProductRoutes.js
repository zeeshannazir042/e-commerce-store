import express from "express";
const router = express.Router();
import formidable from 'express-formidable';
import { checkId } from "../middlewares/checkId.js";
import { authenticator, admin } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchAllProducts,
  fetchById,
  fetchProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts
} from "../Controllers/productController.js";


// PUBLIC ROUTES

// Top-rated products
router.get("/top", fetchTopProducts);
// fetch new products
router.get("/new", fetchNewProducts);

// All products
router.get("/allProducts", fetchAllProducts);

// Get all products (alternative)
router.get("/", fetchProducts);

// PRODUCT DETAILS

// Get single product by ID
router.get("/:id", fetchById);

// PROTECTED ROUTES

// Add a product (admin only)
router.post("/", authenticator, admin, formidable(), addProduct);

// Update a product by ID (admin only)
router.put("/:id", authenticator, admin, checkId, formidable(), updateProductDetails);

// Delete a product by ID (admin only)
router.delete("/:id", authenticator, admin, removeProduct);

// Add a product review (authenticated users, no admin required)
router.post("/:id/reviews", authenticator, checkId, addProductReview);
// fetch new products
router.get("/new", fetchNewProducts);

router.route('/filtered-products').post(filterProducts);

export default router;
