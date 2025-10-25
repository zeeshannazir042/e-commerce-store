import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import store from './Redux/store.js';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import Home from './Pages/Home.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import Profile from './Pages/User/Profile.jsx';
import Shipping from './Pages/Orders/Shipping.jsx';
import Order from './Pages/Orders/Order.jsx';
import PlaceOrder from './Pages/Orders/PlaceOrder.jsx';

// Admin Pages
import AdminRoutes from './Pages/Admin/AdminRoutes.jsx';
import UserList from './Pages/Admin/UserList.jsx';
import CategoryList from './Pages/Admin/CategoryList.jsx';
import ProductList from './Pages/Admin/ProductList.jsx';
import AllProducts from './Pages/Admin/AllProducts.jsx';
import ProductUpdate from './Pages/Admin/ProductUpdate.jsx';

// Components
import { PrivateRoute } from './Components/PrivateRoute.jsx';
import Favorites from './Pages/Products/Favorites.jsx';
import ProductDetails from './Pages/Products/ProductDetails.jsx';
import Cart from './Pages/Cart.jsx';
import Shop from './Pages/Shop.jsx';
import UserOrder from './Pages/User/UserOrder.jsx';
import OrderList from './Pages/Admin/OrderList.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'favorite', element: <Favorites /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'shop', element: <Shop /> },
      { path: 'user-orders', element: <UserOrder /> },

      // Auth routes
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Private routes
      {
        element: <PrivateRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'shipping', element: <Shipping /> },
          { path: 'placeorder', element: <PlaceOrder /> },
          { path: 'order/:id', element: <Order /> },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        element: <AdminRoutes />,
        children: [
          { path: 'userlist', element: <UserList /> },
          { path: 'categorylist', element: <CategoryList /> },
          { path: 'productlist', element: <ProductList /> },
          { path: 'allproductslist', element: <AllProducts /> },
          { path: 'product/update/:id', element: <ProductUpdate /> },
          { path: 'orderlist', element: <OrderList/> },
          { path: 'dashboard', element: <AdminDashboard/> },
        ],
      },
    ],
  },
]);

// Render the app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
