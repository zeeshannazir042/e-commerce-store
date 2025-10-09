import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../Redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../Redux/api/CategoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "../../Pages/Admin/AdminMenu";

const ProductList = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // API hooks
  const { data } = useGetCategoriesQuery();
  const categories = data?.categories || [];
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  // Image preview & upload
 const uploadFileHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImage(file); // save file for local preview
  setImageUrl(URL.createObjectURL(file)); // preview

  try {
    const formData = new FormData();
    formData.append("image", file);

    // Upload to backend
    const uploaded = await uploadProductImage(formData).unwrap();

    // Save **filename returned by backend** (not URL)
    // Backend should return: { filename: "1759881176804-mouse.png" }
    setImage(uploaded.filename);
  } catch (err) {
    console.error(err);
    toast.error("Image upload failed!");
  }
};


  // Submit form
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !description || !price || !category) {
    toast.error("Please fill all required fields!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    formData.append("countInStock", stock);
    formData.append("image", image); // only filename

    const result = await createProduct(formData).unwrap();
    toast.success(`${result.name} created successfully!`);
    navigate("/admin/allproductslist");
  } catch (error) {
    console.error(error);
    toast.error("Failed to create product.");
  }
};


  return (
    <div className="min-h-screen bg-white-200 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-1/4 p-3">
          
        </div>
        <div className="md:w-3/4 p-3">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create Product
          </h2>

          {/* Image preview */}
          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
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
                onChange={uploadFileHandler}
                className="hidden"
              />
            </div>
          </label>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-lg bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
