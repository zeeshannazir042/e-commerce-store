import express from "express";
const router = express.Router();
import { authenticator, admin } from "../middlewares/authMiddleware.js";

import { createCategory,updateCategory,deleteCategory,listCategories,readCategory } from "../Controllers/categoryController.js";


router.route("/").post(authenticator, admin, createCategory)
router.route("/:categoryId").put(authenticator, admin,updateCategory)
.delete(authenticator, admin, deleteCategory)
router.route("/categories").get(listCategories); 
router.route("/:id").get(readCategory);


export default router;