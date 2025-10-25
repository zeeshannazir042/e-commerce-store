import React from "react";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads"; // for local images

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-4 md:ml-64"> {/* Added md:ml-64 to offset sidebar */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : orders.length === 0 ? (
        <Message>Your orders list is empty</Message>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const imageUrl = order.orderItems[0].image.startsWith("http")
              ? order.orderItems[0].image
              : `${IMAGE_BASE_URL}/${encodeURIComponent(order.orderItems[0].image)}`;

            return (
              <div
                key={order._id}
                className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="w-full sm:w-24 flex-shrink-0 mb-2 sm:mb-0">
                  <img
                    src={imageUrl}
                    alt={order.user}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Order Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-4 text-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                    <div>
                      <p className="font-semibold text-gray-800">Order ID:</p>
                      <p className="text-sm">{order._id}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Date:</p>
                      <p className="text-sm">{order.createdAt.substring(0, 10)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Total:</p>
                      <p className="text-sm">€{order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.isPaid ? "bg-green-500" : "bg-red-500"
                      } text-center`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.isDelivered ? "bg-green-500" : "bg-red-500"
                      } text-center`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </div>

                  {/* View Button */}
                  <Link to={`/order/${order._id}`}>
                    <button className="mt-2 sm:mt-0 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrder;
