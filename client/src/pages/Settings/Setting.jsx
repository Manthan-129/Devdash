import React from 'react'
import Sidebar from '../../components/SettingComponents/Sidebar'
import { Outlet } from 'react-router-dom'

const Setting = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Setting