import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../Redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

// Use backend URL for displaying images
const IMAGE_BASE_URL = "http://localhost:5000/uploads";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product!");
      }
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error loading products</div>;

  return (
    <div className="flex flex-col lg:flex-row px-4 md:px-12 py-8 bg-white min-h-screen">
      {/* Sidebar */}
      <aside className="lg:w-1/4 mb-8 lg:mb-0">
        <AdminMenu />
      </aside>

      {/* Product List */}
      <main className="lg:w-3/4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          All Products ({products?.length || 0})
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden flex"
            >
              {/* Product Image */}
              <img
                src={
                  product.image && product.image !== "undefined"
                    ? `${IMAGE_BASE_URL}/${encodeURIComponent(product.image)}`
                    : "/placeholder.png"
                }
                alt={product.name}
                className="w-36 h-36 object-cover rounded-l-lg"
              />

              {/* Product Info */}
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-100">
                      {product.name}
                    </h2>
                    <span className="text-xs text-gray-100">
                      {moment(product.createdAt).format("MMM Do YYYY")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-100 mt-2 line-clamp-3">
                    {product.description?.substring(0, 160)}...
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-base font-bold text-gray-100">
                    € {product.price}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="text-white bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-white bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
