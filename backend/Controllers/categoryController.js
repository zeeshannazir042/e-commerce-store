import e from "express";
import category from "../Models/categoryModel.js";
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
  

   try {

      const { name } = req.body || {};
      if (!name) {
      return res.status(400).json({ message: "Category name is required" });
      }
      const existingCategory = await category.findOne({ name: name.toLowerCase() });
      if (existingCategory) {
         return res.status(400).json({ message: "Category already exists" });
      }
      const newCategory = new category({ name: name.toLowerCase() });
      await newCategory.save();
      res.status(201).json({ message: "Category created successfully", category: newCategory });


   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
   }
});

export const updateCategory = asyncHandler(async (req, res) => {
   try {
      const { categoryId } = req.params || {};
      const { name } = req.body || {};
      if (!name) {
         return res.status(400).json({ message: "Category name is required" });
      }  
      const existingCategory = await
         category.findOne({ name: name.toLowerCase(), _id: { $ne: categoryId } });
      if (existingCategory) {
         return res.status(400).json({ message: "Category name already exists" });
      }  
      const updatedCategory = await category.findByIdAndUpdate(
         categoryId,
         { name: name.toLowerCase() },
         { new: true }
      );  
      if (!updatedCategory) {
         return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
   }
});

 export const deleteCategory = asyncHandler(async (req, res) => {
   try {
      const { categoryId } = req.params || {};
      const deletedCategory = await category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
         return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
   }
});

  export const listCategories = asyncHandler(async (req, res) => {
   try {
      const categories = await category.find().sort({ createdAt: -1 });
      res.status(200).json({ categories });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
   }
});
   export const readCategory = asyncHandler(async (req, res) => {
   try {
      const { id } = req.params || {};
      const categoryData = await category.findById(id);
      if (!categoryData) {
         return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ category: categoryData });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
   }
});

