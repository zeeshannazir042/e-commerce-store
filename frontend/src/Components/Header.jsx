import React from "react";
import { useGetTopProductsQuery } from "../Redux/api/productApiSlice";
import Loader from "./Loader.jsx";
import SmallProduct from "../Pages/Products/SmallProduct.jsx";
import ProductCarosel from "../Pages/Products/ProductCarosel.jsx";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1 className="text-center text-red-500">ERROR</h1>;

  return (
    <div className="py-8 bg-gray-50">
      {/* Centered container with padding */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Top Products
        </h2>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-items-center">
          {data.map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>
        <ProductCarosel/>
      </div>

    </div>
  );
};

export default Header;
