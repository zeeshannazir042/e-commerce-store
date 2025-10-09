import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../../Redux/api/usersApiSlice';
import { setCredientials } from '../../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredientials(res.user || res));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration / Gradient */}
      <div className="lg:w-1/2 w-full h-64 lg:h-auto bg-gradient-to-br from-black to-indigo-900 flex items-center justify-center p-6">
        <div className="text-white text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Sign in to continue to your account and explore amazing products.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-gray-600 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={submitHandler}>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                autoComplete="off"
                className="peer h-12 w-full border-b-2 border-gray-300 placeholder-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400
                  peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
                className="peer h-12 w-full border-b-2 border-gray-300 placeholder-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
              <label
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400
                  peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center"
            >
              {isLoading ? <Loader /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            New here?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
