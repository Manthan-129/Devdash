import React,{ useContext } from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

import Setting from './pages/Settings/Setting.jsx'
import Profile from './pages/Settings/Profile.jsx'
import Notification from './pages/Settings/Notification.jsx'
import Security from './pages/Settings/Security.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'


import WorkPlace from './pages/WorkPlace.jsx'

import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/settings' element={<Setting />}>
          <Route index element={<Profile />}></Route>  {/* Default route for /settings */}
          <Route path='notification' element={<Notification />}></Route>
          <Route path='security' element={<Security />}></Route>
        </Route>
        <Route path='/workplace' element={<WorkPlace />}></Route>
      </Routes>
    </div>
  )
}

export default App