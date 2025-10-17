import React from "react";
import { Link } from "react-router-dom";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const SmallProduct = ({ product }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full max-w-sm">
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden rounded-t-2xl">
          <img
            src={
              product.image && product.image !== "undefined"
                ? `${IMAGE_BASE_URL}/${encodeURIComponent(product.image)}`
                : "/placeholder.png"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <h2 className="text-md sm:text-lg md:text-xl font-semibold line-clamp-1">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Price</span>
              <span className="text-lg font-bold text-yellow-500">
                €{product.price}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">
              {product.description || "No description available."}
            </p>
          </div>

          <button className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
