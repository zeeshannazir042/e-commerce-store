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
      setMobileOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { name: "Home", icon: <AiOutlineHome size={26} />, path: "/" },
    { name: "Shop", icon: <AiOutlineShopping size={26} />, path: "/shop" },
    { name: "Cart", icon: <AiOutlineShoppingCart size={26} />, path: "/cart" },
    { name: "Favorite", icon: <FaHeart size={26} />, path: "/favorite" },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <div
        className={`hidden md:flex flex-col justify-between fixed top-0 left-0 h-full bg-white text-black p-4 shadow-md transition-all duration-300 ${
          hovered ? "w-48" : "w-16"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {item.icon}
              {hovered && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center w-full px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FaUser size={26} />
            {hovered && userInfo?.username && (
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

          {dropdownOpen && hovered && userInfo && (
            <ul className="absolute bottom-12 left-0 w-full bg-white text-black border rounded-md shadow-lg z-20">
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
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3 text-white fixed top-4 left-4 bg-black rounded-md z-50"
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
                className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4">
            {userInfo && (
              <>
                <p className="mb-2 font-medium">{userInfo.username}</p>
                {userInfo.isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/categorylist"
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      Category
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/userlist"
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      Users
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="block px-2 py-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
            {!userInfo && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  <AiOutlineLogin size={26} /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  <AiOutlineUserAdd size={26} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
