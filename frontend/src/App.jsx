import React from 'react'
import {Outlet} from "react-router-dom"
import Navigation from "./Pages/Auth/Navigation";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {


  return (
    <>
      <ToastContainer />
      <Navigation/>
      <Outlet/>
    </>
  )
}

export default App
