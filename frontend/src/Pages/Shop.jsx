import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../Redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked } = useSelector((state) => state.shop);
  const [selectedBrand, setSelectedBrand] = useState("");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const [showCategories, setShowCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  const categoriesQuery = useGetCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked });

  // Set categories in Redux
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      const categoryArray = categoriesQuery.data.categories || categoriesQuery.data || [];
      dispatch(setCategories(categoryArray));
    }
  }, [categoriesQuery.data, dispatch]);

  // Filter products based on checked categories, price range, and brand
  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filtered = filteredProductsQuery.data;

      // Price range filtering
      const from = parseFloat(priceFrom);
      const to = parseFloat(priceTo);
      if (!isNaN(from)) filtered = filtered.filter((p) => p.price >= from);
      if (!isNaN(to)) filtered = filtered.filter((p) => p.price <= to);

      // Brand filter
      if (selectedBrand) filtered = filtered.filter((p) => p.brand === selectedBrand);

      dispatch(setProducts(filtered));
    }
  }, [checked, filteredProductsQuery.data, dispatch, priceFrom, priceTo, selectedBrand]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => setSelectedBrand(brand);

  const resetFilters = () => {
    dispatch(setChecked([]));
    setPriceFrom("");
    setPriceTo("");
    setSelectedBrand("");
    dispatch(setProducts(filteredProductsQuery.data || []));
  };

  const uniqueBrands = Array.from(
    new Set(filteredProductsQuery.data?.map((p) => p.brand).filter(Boolean))
  );

  return (
    <div className="ml-64 flex flex-col p-4"> {/* Offset for sidebar */}
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-lg relative z-10">
        {/* Categories Dropdown */}
        <div className="relative">
          <button
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowCategories(!showCategories)}
          >
            Categories {showCategories ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showCategories && (
            <div className="absolute left-0 mt-2 bg-white p-3 rounded-lg shadow-lg min-w-[200px] flex flex-col gap-2 z-50 border border-gray-200">
              {categories?.map((c) => (
                <label
                  key={c._id}
                  className="flex items-center gap-2 text-gray-800 text-sm cursor-pointer hover:text-pink-500"
                >
                  <input
                    type="checkbox"
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="accent-pink-500 w-4 h-4"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands Dropdown */}
        <div className="relative">
          <button
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowBrands(!showBrands)}
          >
            Brands {showBrands ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showBrands && (
            <div className="absolute left-0 mt-2 bg-white p-3 rounded-lg shadow-lg min-w-[200px] flex flex-col gap-2 z-50 border border-gray-200">
              {uniqueBrands?.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-gray-800 text-sm cursor-pointer hover:text-pink-500"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => handleBrandClick(brand)}
                    className="accent-pink-500 w-4 h-4"
                  />
                  {brand}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="relative">
          <button
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowPrice(!showPrice)}
          >
            Price {showPrice ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showPrice && (
            <div className="absolute left-0 mt-2 bg-white p-3 rounded-lg shadow-lg min-w-[220px] z-50 border border-gray-200 flex flex-col gap-2">
              <input
                type="number"
                placeholder="Price From €"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="number"
                placeholder="Price To €"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl text-gray-800 font-bold mb-4">{products?.length || 0} Products</h2>
      {filteredProductsQuery.isLoading ? (
        <Loader />
      ) : products?.length === 0 ? (
        <div className="text-gray-800 text-center py-10">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
