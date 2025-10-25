import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const imageUrl = p.image?.startsWith("http")
    ? p.image
    : `${IMAGE_BASE_URL}/${encodeURIComponent(p.image)}`;

  return (
    <div className="max-w-sm relative bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <section className="relative overflow-hidden rounded-t-xl">
        <Link to={`/product/${p._id}`}>
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-yellow-400 shadow-md">
            {p?.brand}
          </span>

          <img
            className="cursor-pointer w-full h-48 object-cover rounded-t-xl transform hover:scale-105 transition-all duration-300"
            src={imageUrl}
            alt={p?.name}
          />
        </Link>

        <HeartIcon product={p} className="absolute top-3 right-3" />
      </section>

      <div className="p-5 flex flex-col justify-between h-[220px]">
        <div>
          <h5 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
            {p?.name}
          </h5>
          <p className="text-pink-500 font-bold text-lg mt-1">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {p?.description || "No description available"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/product/${p._id}`}
            className="text-white bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm md:text-base"
          >
            Read More
            <svg
              className="w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            onClick={() => addToCartHandler(p, 1)}
            className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-lg transition-all duration-300"
          >
            <AiOutlineShoppingCart size={25} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
