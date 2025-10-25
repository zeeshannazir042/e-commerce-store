import express from "express";
import {   createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered } from "../Controllers/orderController.js";

const router = express.Router();

import { authenticator, admin } from "../middlewares/authMiddleware.js";


router
  .route("/")
  .post(authenticator, createOrder)
  .get(authenticator, admin, getAllOrders);

router.route("/mine").get(authenticator, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticator, findOrderById);
router.route("/:id/pay").put(authenticator, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticator, admin, markOrderAsDelivered);

export default router;
