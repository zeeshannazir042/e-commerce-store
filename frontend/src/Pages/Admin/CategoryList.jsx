import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '../../Redux/api/CategoryApiSlice.js';
import CategoryForm from '../../Components/CategoryForm.jsx';
import AdminMenu from '../../Pages/Admin/AdminMenu';

function CategoryList() {
    const { data, isLoading, isError, error } = useGetCategoriesQuery();
    const categories = Array.isArray(data) ? data : data?.categories || [];

    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateName, setUpdateName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    // Create category handler
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Category name is required');
        try {
            await createCategory({ name }).unwrap();
            toast.success('Category created successfully');
            setName('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Update category handler
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!updateName.trim()) return toast.error('Category name is required');
        try {
            await updateCategory({ id: selectedCategory._id, name: updateName }).unwrap();
            toast.success('Category updated successfully');
            setModalVisible(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Delete category handler
    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(categoryId).unwrap();
            toast.success('Category deleted successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                
                <AdminMenu/>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Categories</h2>

                {/* Create Category Form */}
                <div className="mb-6">
                    <CategoryForm value={name} setValue={setName} handleSubmit={handleCreate} button="Create" />
                </div>

                <hr className="my-6" />

                {/* Loading / Error */}
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading categories...</p>
                ) : isError ? (
                    <p className="text-center text-red-500">Error: {error?.data?.message || error.error}</p>
                ) : categories.length === 0 ? (
                    <p className="text-center text-gray-500">No categories found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-6 text-left font-medium text-gray-700">Category Name</th>
                                    <th className="py-3 px-6 text-center font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-100 transition-colors">
                                        <td className="py-3 px-6">{category.name}</td>
                                        <td className="py-3 px-6 text-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setUpdateName(category.name);
                                                    setModalVisible(true);
                                                }}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Update Category Modal */}
                {modalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Category</h3>
                            <CategoryForm value={updateName} setValue={setUpdateName} handleSubmit={handleUpdate} button="Update" />
                            <button
                                onClick={() => setModalVisible(false)}
                                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryList;
