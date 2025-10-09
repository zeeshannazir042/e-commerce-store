import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../Redux/api/usersApiSlice';
import { setCredientials } from '../../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await register({ username: name, email, password }).unwrap();
      dispatch(setCredientials(res.user || res));
      toast.success('Registration Successful');
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Gradient / Illustration */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-black to-indigo-900 justify-center items-center">
        <h1 className="text-white text-4xl font-bold p-8">Join Us!</h1>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Register
          </h2>

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor="name"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Password
            </label>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Confirm Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors"
          >
            Register
          </button>

          {/* Loader */}
          {isLoading && <Loader />}

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Have an Account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-indigo-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
