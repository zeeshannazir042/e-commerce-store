import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Loader from '../../Components/Loader';
import { toast } from 'react-toastify';
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from '../../Redux/api/usersApiSlice';
import Message from '../../Components/Message';
import AdminMenu from '../../Pages/Admin/AdminMenu';

const UserList = () => {
    const { data: users, isLoading, refetch, error } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const [editUserId, setEditUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleEditClick = (user) => {
        if (!user._id) return toast.error("User ID not found");
        setEditUserId(user._id);
        setUsername(user.username);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
    };

    const handleCancelClick = () => {
        setEditUserId(null);
        setUsername('');
        setEmail('');
        setIsAdmin(false);
    };

    const handleSaveClick = async (user) => {
        if (!user._id) return toast.error("User ID not found");
        try {
            await updateUser({ id: user._id, username, email, isAdmin }).unwrap();
            toast.success('User updated successfully');
            handleCancelClick();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleDeleteClick = async (user) => {
        if (!user._id) return toast.error("User ID not found");
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(user._id).unwrap();
                toast.success('User deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading || loadingDelete || loadingUpdate) return <Loader />;
    if (error) return <Message varient="error">{error?.data?.message || error.error}</Message>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
               <AdminMenu/>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Management</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 table-auto rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr className="text-center">
                                <th className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300">ID</th>
                                <th className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300">Username</th>
                                <th className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300">Email</th>
                                <th className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300">Admin</th>
                                <th className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors text-center">
                                    <td className="py-2 px-4 border-b border-gray-300">{user._id}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {editUserId === user._id ? (
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="border rounded px-2 py-1 w-full text-center"
                                            />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {editUserId === user._id ? (
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="border rounded px-2 py-1 w-full text-center"
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {editUserId === user._id ? (
                                            <input
                                                type="checkbox"
                                                checked={isAdmin}
                                                onChange={(e) => setIsAdmin(e.target.checked)}
                                                className="h-4 w-4 mx-auto"
                                            />
                                        ) : user.isAdmin ? (
                                            <FaCheck className="text-green-500 mx-auto" />
                                        ) : (
                                            <FaTimes className="text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {editUserId === user._id ? (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleSaveClick(user)}
                                                    className="text-green-500 hover:text-green-700"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={handleCancelClick}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
