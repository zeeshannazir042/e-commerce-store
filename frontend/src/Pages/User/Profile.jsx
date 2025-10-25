import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../../Components/Loader';
import { setCredientials } from '../../Redux/features/auth/authSlice';
import { useProfileMutation } from '../../Redux/api/usersApiSlice';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredientials(res.user || res));
      toast.success('Profile Updated Successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err?.data?.message || err.error || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">User Profile</h1>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loadingUpdateProfile}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
          </button>

          <Link
            to="/user-orders"
            className="block text-center mt-2 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition"
          >
            View Orders
          </Link>
        </form>

        {loadingUpdateProfile && (
          <div className="mt-4">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
