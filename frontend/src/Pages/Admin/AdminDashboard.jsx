import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../Redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../Components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line" },
      tooltip: { theme: "dark" },
      colors: ["#00E396"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left" },
      grid: { borderColor: "#ccc" },
      markers: { size: 4 },
      xaxis: { categories: [], title: { text: "Date" } },
      yaxis: { title: { text: "Sales" }, min: 0 },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSales = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { categories: formattedSales.map((i) => i.x) },
        },
        series: [{ name: "Sales", data: formattedSales.map((i) => i.y) }],
      }));
    }
  }, [salesDetail]);

  const loading = loadingSales || loadingCustomers || loadingOrders;

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminMenu className="w-16 fixed h-screen" /> {/* Narrow sidebar ~64px */}

      {/* Main Content */}
      <main className="flex-1 ml-16 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-6 justify-start">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 min-w-[200px] hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Sales</div>
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">€</div>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {loading ? <Loader /> : `$${sales?.totalSales.toFixed(2)}`}
            </h2>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 min-w-[200px] hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Customers</div>
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">👤</div>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {loading ? <Loader /> : customers?.length || 0}
            </h2>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 min-w-[200px] hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Orders</div>
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">🛒</div>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              {loading ? <Loader /> : orders?.totalOrders || 0}
            </h2>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition overflow-x-auto">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            height={350}
          />
        </div>

        {/* Orders List */}
        <div className="mt-10">
          <OrderList />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
