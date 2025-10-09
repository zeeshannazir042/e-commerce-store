import { useState } from "react";
import { NavLink } from "react-router";
import { FaTimes } from "react-icons/fa";
import React from 'react'

const AdminMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu =() =>{
        setIsMenuOpen(!isMenuOpen)

    } 
  return (
   <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-[#151515] p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-[#ffffff] p-4 fixed right-7 top-5 rounded-md">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="py-2 px-3 block mb-5 hover:bg-[#dcd9d9] rounded-sm"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "green" : "black  ",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  )
}

export default AdminMenu