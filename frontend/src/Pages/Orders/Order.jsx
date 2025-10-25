import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const OrderContent = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId && order && !order.isPaid) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (!window.paypal) loadPayPalScript();
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const createOrder = (data, actions) =>
    actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order paid successfully!");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen p-4 md:p-8 transition-all">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <span className="text-sm text-gray-500 mt-2 sm:mt-0">
            Order ID: <span className="font-semibold">{order._id}</span>
          </span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Ordered Items */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                Ordered Items
              </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs md:text-sm">
                      <tr>
                        <th className="py-2 px-3 text-left">Image</th>
                        <th className="py-2 px-3 text-left">Product</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Price</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, i) => {
                        const imageUrl = item.image?.startsWith("http")
                          ? item.image
                          : `${IMAGE_BASE_URL}/${encodeURIComponent(item.image)}`;
                        return (
                          <tr key={i} className="border-t hover:bg-gray-50 transition">
                            <td className="py-2 px-3">
                              <img
                                src={imageUrl}
                                alt={item.name}
                                onError={(e) =>
                                  (e.target.src = "/images/placeholder.png")
                                }
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Link
                                to={`/product/${item.product}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {item.name}
                              </Link>
                            </td>
                            <td className="py-2 px-3 text-center">{item.qty}</td>
                            <td className="py-2 px-3 text-right">€{item.price.toFixed(2)}</td>
                            <td className="py-2 px-3 text-right">
                              €{(item.qty * item.price).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                Shipping Details
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Name:</strong> {order.user.username}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
              </div>
              <div className="mt-4">
                {order.isPaid ? (
                  <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 h-fit hover:shadow-lg transition flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between"><span>Items</span><span>€{order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>€{order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>€{order.taxPrice.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold text-gray-900 border-t pt-3"><span>Total</span><span>€{order.totalPrice.toFixed(2)}</span></div>
            </div>

            {/* PayPal Buttons */}
            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay || isPending ? <Loader /> : <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} style={{ layout: "vertical" }} />}
              </div>
            )}

            {/* Admin Deliver Button */}
            {loadingDeliver && <Loader />}
            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                onClick={deliverHandler}
                className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const { data: paypal } = useGetPaypalClientIdQuery();
  return (
    <PayPalScriptProvider options={{ "client-id": paypal?.clientId || "test", currency: "USD" }}>
      <OrderContent />
    </PayPalScriptProvider>
  );
};

export default Order;
