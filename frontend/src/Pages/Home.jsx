import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../Redux/api/productApiSlice";

import Loader from "../Components/Loader";
import Header from "../Components/Header";
import Message from "../Components/Message";
import Product from "./Products/Product";

const Home = () => {
  const IMAGE_BASE_URL = "http://localhost:5000/uploads";
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery(keyword || "");
  const products = data?.products || [];

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full py-2 px-6 shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 text-sm md:text-base"
            >
              Shop
            </Link>
          </div>

          {/* Products Grid */}
          <div className="flex justify-center flex-wrap mt-8 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">No products found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
