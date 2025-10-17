import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../Redux/api/usersApiSlice";
import { logout } from "../../Redux/features/auth/authSlice";
import FavoriteCount from "../Products/FavoriteCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      setMobileOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { name: "Home", icon: <AiOutlineHome size={24} />, path: "/" },
    { name: "Shop", icon: <AiOutlineShopping size={24} />, path: "/shop" },
    { name: "Cart", icon: <AiOutlineShoppingCart size={24} />, path: "/cart" },
    { name: "Favorite", icon: <FaHeart size={24} />, path: "/favorite" },
  ];

  const renderUserButtons = (isDesktop = false) => {
    if (userInfo) return null; // Logged-in users see dropdown, not buttons

    if (isDesktop) {
      return hovered ? (
        <div className="flex flex-col space-y-2 mt-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-all"
          >
            <AiOutlineLogin size={20} /> Login
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition-all"
          >
            <AiOutlineUserAdd size={20} /> Register
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center mt-4">
          <AiOutlineLogin size={24} className="text-gray-600" />
          <AiOutlineUserAdd size={24} className="text-gray-600" />
        </div>
      );
    } else {
      // Mobile sidebar
      return (
        <div className="flex flex-col space-y-2 mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-all"
            onClick={() => setMobileOpen(false)}
          >
            <AiOutlineLogin size={20} /> Login
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition-all"
            onClick={() => setMobileOpen(false)}
          >
            <AiOutlineUserAdd size={20} /> Register
          </Link>
        </div>
      );
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col justify-between fixed top-0 left-0 h-full bg-white text-black p-4 shadow-lg transition-all duration-300 z-50 ${
          hovered ? "w-56" : "w-20"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-xl transition-colors relative group"
            >
              {item.icon}
              {item.name === "Favorite" && <FavoriteCount />}
              {hovered && <span className="font-medium">{item.name}</span>}
              {!hovered && (
                <span className="absolute left-full ml-2 w-max bg-black text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="relative mt-4">
          {userInfo ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center w-full px-3 py-3 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <FaUser size={24} />
                {hovered && (
                  <>
                    <span className="ml-2 font-medium">{userInfo.username}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>

              {dropdownOpen && hovered && (
                <ul className="absolute bottom-20 left-0 w-full bg-white border rounded-xl shadow-lg z-20 overflow-hidden">
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/productlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/categorylist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/orderlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/userlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
          </> ) : renderUserButtons(true)}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3 text-white fixed top-4 left-4 bg-black rounded-full z-50 shadow-lg"
        >
          <FaUser size={26} />
        </button>

        <div
          className={`fixed top-0 left-0 h-full bg-white text-black p-4 z-40 transform transition-transform duration-300 w-64 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="mb-4 p-2 text-black bg-gray-200 rounded-md"
          >
            <AiOutlineClose size={26} />
          </button>

          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-xl transition-colors relative"
              >
                {item.icon}
                {item.name === "Favorite" && <FavoriteCount />}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {renderUserButtons(false)}
        </div>
      </div>
    </>
  );
};

export default Navigation;
