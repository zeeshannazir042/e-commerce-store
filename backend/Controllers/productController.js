import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../Models/ProductModel.js";

// @desc    Create a new product
const addProduct = asyncHandler(async (req, res) => {
    // Get product data from req.body
    const { name, price, brand, quantity, category, description } = req.fields;

    // Validate required fields
    switch (true) {
        case !name:
            return res.status(400).json({ message: "Product name is required" });
        case !price:
            return res.status(400).json({ message: "Product price is required" });
        case !brand:
            return res.status(400).json({ message: "Product brand is required" });
        case !quantity:
            return res.status(400).json({ message: "Product quantity is required" });
        case !category:
            return res.status(400).json({ message: "Product category is required" });
        case !description:
            return res.status(400).json({ message: "Product description is required" });
    }
    const product = new Product({...req.fields}); 
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

});
const updateProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, brand, quantity, category, description } = req.fields;
    // Validate required fields
    switch (true) {
        case !name:
            return res.status(400).json({ message: "Product name is required" });
        case !price:
            return res.status(400).json({ message: "Product price is required" });  
        case !brand:
            return res.status(400).json({ message: "Product brand is required" });
        case !quantity:
            return res.status(400).json({ message: "Product quantity is required" });
        case !category:
            return res.status(400).json({ message: "Product category is required" });
        case !description:
            return res.status(400).json({ message: "Product description is required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { name, price, brand, quantity, category, description } },
        { new: true }
    );
        if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
});
// @desc    delete a product
const removeProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
});
const fetchProducts = asyncHandler(async (req, res) => {
   try {
    const pageSize = 6;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.json({ products, page: 1, pages: Math.ceil(count / pageSize),hasMore:false });
    
   } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error(error);
   }
});
const fetchById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
const products = await Product.find({})
  .populate("category")
  .sort({ createdAt: -1 })
  .limit(12);
  res.status(200).json(products);
});
const addProductReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }   
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
    }
    const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
}
);

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error(error);

  }
});
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    res.status(200).json(products);
    } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error(error);
    }
});
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;
    let args = {};

    if (checked.length > 0) {
      args.category = { $in: checked }; // ✅ Must use $in for array
    }

    if (radio.length === 2) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
   // make sure this appears only once
};


