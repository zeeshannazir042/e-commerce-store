import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

function Product({ product }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col w-full sm:w-80">
      
      {/* Image Section */}
      <div className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden rounded-t-2xl">
        <img
          src={
            product.image && product.image !== "undefined"
              ? `${IMAGE_BASE_URL}/${encodeURIComponent(product.image)}`
              : "/placeholder.png"
          }
          alt={product.name || "Product Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>

        {/* Favorite Icon */}
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h2>

        <p className="text-yellow-500 font-bold text-md mb-2">€{product.price?.toFixed(2)}</p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description || "No description available."}
        </p>

        <Link
          to={`/product/${product._id}`}
          className="mt-auto bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-2 px-4 rounded-full text-center hover:from-pink-600 hover:to-pink-700 shadow-lg transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default Product;
