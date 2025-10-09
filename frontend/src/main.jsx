import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import Login from './Pages/Auth/Login.jsx'
import Register from './Pages/Auth/Register.jsx'
//private route
import { PrivateRoute } from './Components/PrivateRoute.jsx'
import Profile from './Pages/User/Profile.jsx'
//admin routes
import AdminRoutes from './Pages/Admin/AdminRoutes.jsx'
import UserList from './Pages/Admin/UserList.jsx'
import CategoryList from './Pages/Admin/CategoryList.jsx'
import ProductList from './Pages/Admin/ProductList.jsx'
import ProductUpdate from './Pages/Admin/ProductUpdate.jsx'
import AllProducts from './Pages/Admin/AllProducts.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route path='/' element = {<PrivateRoute/>}>
      <Route path='/profile' element = {<Profile/>}/>
      </Route>
      <Route path='/login' element = {<Login/>}/>
      <Route path='/register' element = {<Register/>}/>

      <Route path='/admin' element = {<AdminRoutes/>}>
      <Route path='userlist' element = {<UserList/>}/>
      <Route path='categorylist' element = {<CategoryList/>}/>
      <Route path='productlist' element={<ProductList/>}/>
      <Route path='allproductslist' element={<AllProducts/>}/>

      <Route path='product/update/:id' element={<ProductUpdate/>}/>
      </Route>

    </Route>
    
    
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

)
