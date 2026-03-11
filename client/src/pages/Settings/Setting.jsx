import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/SettingComponents/Sidebar'

const Setting = () => {
  return (
    <div className="flex h-screen bg-gray-50/80">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Setting