import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useReviewProductMutation,
} from "../../Redux/api/productApiSlice";
import Loader from "../../Components/Loader";
import Message from "../../Components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../Redux/features/cart/cartSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useReviewProductMutation();

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  const imageUrl = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${IMAGE_BASE_URL}/${encodeURIComponent(product.image)}`
    : "/placeholder.png";

  // ✅ Submit Review
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing!");
      return;
    }

    try {
      await createReview({
        id: productId,
        review: { rating, comment },
      }).unwrap();

      refetch();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // ✅ Add to Cart
  const addToCartHandler = () => {
    if (!product) return;

    dispatch(addToCart({ ...product, qty: Number(qty) }));
    toast.success(`${product.name} added to cart`);
    navigate("/cart");
  };

  return (
    <div className="ml-0 lg:ml-64 p-6 min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link
        to="/"
        className="text-pink-600 font-semibold hover:underline mb-6 inline-block"
      >
        &larr; Go Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-3xl shadow-lg">
        {/* Left: Product Image */}
        <div className="flex-1 relative group">
          <img
            src={imageUrl}
            alt={product?.name}
            className="w-full rounded-3xl shadow-xl object-cover max-h-[600px] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <HeartIcon product={product} />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            {product?.name}
          </h2>
          <p className="text-gray-600 text-base lg:text-lg">
            {product?.description}
          </p>

          <p className="text-4xl lg:text-5xl font-extrabold text-pink-600">
            ${product?.price?.toFixed(2)}
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <FaStore className="text-pink-600" /> Brand: {product?.brand}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaClock className="text-pink-600" /> Added:{" "}
                {moment(product?.createdAt).fromNow()}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaStar className="text-yellow-400" /> Reviews:{" "}
                {product?.numReviews || 0}
              </p>
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <FaStar className="text-yellow-400" /> Ratings:{" "}
                {product?.rating?.toFixed(1) || 0}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaShoppingCart className="text-pink-600" /> Quantity: {qty}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaBox className="text-pink-600" /> In Stock:{" "}
                {product?.countInStock || 0}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Ratings
              value={product?.rating}
              text={`${product?.numReviews || 0} reviews`}
            />

            {product?.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300 text-black"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={addToCartHandler}
            disabled={product?.countInStock === 0}
            className={`mt-4 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg ${
              product?.countInStock > 0
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {product?.countInStock > 0 ? "Add To Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Product Tabs / Reviews */}
      {product && (
        <div className="mt-12">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
            productId={productId}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
