import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

import ForgotPassword from './pages/ForgotPassword.jsx'
import Notification from './pages/Settings/Notification.jsx'
import Profile from './pages/Settings/Profile.jsx'
import Security from './pages/Settings/Security.jsx'
import Setting from './pages/Settings/Setting.jsx'

import DashboardLayout from './components/DashboardComponents/DashboardLayout.jsx'
import DashboardOverview from './pages/Dashboard/DashboardOverview.jsx'
import Friends from './pages/Dashboard/Friends.jsx'
import Invitations from './pages/Dashboard/Invitations.jsx'
import PullRequests from './pages/Dashboard/PullRequests.jsx'
import TeamDetail from './pages/Dashboard/TeamDetail.jsx'
import Teams from './pages/Dashboard/Teams.jsx'

import { AppContext } from './context/AppContext.jsx'

import { ToastContainer } from 'react-toastify'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  if (!token) return <Navigate to="/login" />;
  return children;
};

const App = () => {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/settings' element={<ProtectedRoute><Setting /></ProtectedRoute>}>
          <Route index element={<Profile />}></Route>
          <Route path='notification' element={<Notification />}></Route>
          <Route path='security' element={<Security />}></Route>
        </Route>
        <Route path='/dashboard' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardOverview />}></Route>
          <Route path='friends' element={<Friends />}></Route>
          <Route path='teams' element={<Teams />}></Route>
          <Route path='teams/:teamId' element={<TeamDetail />}></Route>
          <Route path='pull-requests' element={<PullRequests />}></Route>
          <Route path='invitations' element={<Invitations />}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App