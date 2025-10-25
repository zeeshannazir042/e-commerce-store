import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../Redux/features/cart/cartSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="ml-[6rem] mr-4 mt-8 px-4"> 
      {/* ✅ Added left margin (ml-[6rem]) to offset fixed sidebar */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-700">
          Your cart is empty{" "}
          <Link to="/shop" className="text-pink-500 font-semibold hover:underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

            {cartItems.map((item) => {
              const imageUrl = item.image.startsWith("http")
                ? item.image
                : `${IMAGE_BASE_URL}/${encodeURIComponent(item.image)}`;

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 mb-4 gap-4"
                >
                  {/* Image */}
                  <div className="w-[5rem] h-[5rem] flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-pink-600 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-500 text-sm">{item.brand}</div>
                    <div className="text-gray-900 font-bold mt-1">
                      €{item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="w-24">
                    <select
                      className="w-full p-2 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove */}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p className="text-gray-700 mb-2">
              Items:{" "}
              <span className="font-bold">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </p>
            <p className="text-gray-700 mb-4">
              Total:{" "}
              <span className="font-bold text-pink-600 text-2xl">
                €
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </p>
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 w-full rounded-full font-semibold transition"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
