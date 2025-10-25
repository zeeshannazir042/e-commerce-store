import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../Components/Message";
import ProgressSteps from "../../Components/ProgressSteps";
import Loader from "../../Components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads"; // Adjust your server URL

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Redirect if shipping address is missing
  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, navigate]);

  // Compute totals
  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: free shipping over €100
  const taxPrice = +(0.15 * itemsPrice).toFixed(2); // 15% tax
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ProgressSteps step1 step2 step3 />
      <div className="max-w-5xl mx-auto mt-8 flex flex-col lg:flex-row gap-8">
        {/* Order Items */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Items</h2>
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartItems.map((item, index) => {
                    const imageUrl = item.image.startsWith("http")
                      ? item.image
                      : `${IMAGE_BASE_URL}/${encodeURIComponent(item.image)}`;

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-3">
                          <Link
                            className="text-pink-500 hover:underline"
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-3">{item.qty}</td>
                        <td className="p-3">€{item.price.toFixed(2)}</td>
                        <td className="p-3">€{(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="flex flex-col gap-3 text-gray-700">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>€{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>€{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>€{taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total:</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping</h2>
            <p className="text-gray-700">
              <strong>Address:</strong> {cart.shippingAddress.address},{" "}
              {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
              {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
          </div>

          {error && <Message variant="danger">{error.data?.message || error.message}</Message>}

          <button
            type="button"
            className="bg-pink-500 text-white py-3 px-4 rounded-full text-lg w-full hover:bg-pink-600 transition"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
