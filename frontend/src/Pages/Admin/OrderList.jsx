import React from "react";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const IMAGE_BASE_URL = "http://localhost:5000/uploads"; // Change if your server URL differs

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminMenu className="w-64 fixed h-screen" />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-4 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders List</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : orders.length === 0 ? (
          <Message>No orders found.</Message>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const imageUrl = order.orderItems[0]?.image.startsWith("http")
                ? order.orderItems[0].image
                : `${IMAGE_BASE_URL}/${encodeURIComponent(order.orderItems[0]?.image)}`;

              return (
                <div
                  key={order._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition overflow-x-auto"
                >
                  {/* Image */}
                  <div className="w-full sm:w-24 flex-shrink-0 mb-2 sm:mb-0">
                    <img
                      src={imageUrl}
                      alt={order._id}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-4 text-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                      <div>
                        <p className="font-semibold text-gray-800">ID:</p>
                        <p className="text-sm">{order._id}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">User:</p>
                        <p className="text-sm">{order.user?.username || "N/A"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Date:</p>
                        <p className="text-sm">
                          {order.createdAt?.substring(0, 10) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Total:</p>
                        <p className="text-sm">€ {order.totalPrice}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm text-center ${
                          order.isPaid ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm text-center ${
                          order.isDelivered ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Pending"}
                      </span>
                    </div>

                    {/* View Button */}
                    <Link to={`/order/${order._id}`}>
                      <button className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
