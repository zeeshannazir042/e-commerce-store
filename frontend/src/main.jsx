import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
import store from './Redux/store.js';

import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';

// Pages
import Home from './Home.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import Profile from './Pages/User/Profile.jsx';

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> }, // Home page
      {path:'/favorite', element: <Favorites/> },
      {path:'/product/:id', element: <ProductDetails/>},

      // Auth routes
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Private routes
      {
        element: <PrivateRoute />, // Private wrapper
        children: [
          { path: 'profile', element: <Profile /> },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        element: <AdminRoutes />, // Admin wrapper
        children: [
          { path: 'userlist', element: <UserList /> },
          { path: 'categorylist', element: <CategoryList /> },
          { path: 'productlist', element: <ProductList /> },
          { path: 'allproductslist', element: <AllProducts /> },
          { path: 'product/update/:id', element: <ProductUpdate /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
