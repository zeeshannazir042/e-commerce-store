import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../Redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../Redux/api/CategoryApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import { BASE_URL, UPLOAD_URL } from "../../Redux/constance"; // Add your backend base URL

function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ProductData, isLoading, isError } = useGetProductByIdQuery(id);
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (ProductData) {
      setName(ProductData.name || "");
      setDescription(ProductData.description || "");
      setPrice(ProductData.price || "");
      setCategory(ProductData.category || "");
      setQuantity(ProductData.quantity || "");
      setBrand(ProductData.brand || "");
      setStock(ProductData.countInStock || "");
      setImage(ProductData.image || null);

      // Correctly build image preview URL
      if (ProductData.image) {
        // If image is already a URL or filename, point to the backend uploads folder
        setImagePreview(`${BASE_URL}/uploads/${encodeURIComponent(ProductData.image)}`);
      } else {
        setImagePreview(""); // fallback if no image
      }
    }
  }, [ProductData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // preview newly uploaded file
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("_id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      if (image instanceof File) {
        formData.append("image", image); // newly uploaded file
      } else if (typeof image === "string") {
        formData.append("image", image); // existing filename
      }

      await updateProduct(formData).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully!");
        navigate("/admin/allproductslist");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product!");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row">
        <div className="md:w-1/4 p-3">
          <AdminMenu />
        </div>
        <div className="md:w-3/4 p-3">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Update Product
          </h2>

          <form className="space-y-6" onSubmit={handleUpdate}>
            {imagePreview && (
              <div className="flex justify-center mb-6">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 object-contain rounded-md"
                />
              </div>
            )}

            <label className="block mb-6 text-center">
              <div className="cursor-pointer px-6 py-8 border-dashed border-2 border-gray-400 rounded-lg text-gray-400 hover:border-pink-500 hover:text-white transition-colors">
                {image ? image.name || "Uploaded Image" : "Click to Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </label>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400 resize-none h-32"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-4 rounded-lg w-full bg-gray-700 text-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="w-2/3 py-4 rounded-lg bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-1/3 ml-4 py-4 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdate;
