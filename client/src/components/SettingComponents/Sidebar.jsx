import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

    const menuItems = [
        { name: 'Profile', path: '/settings', icon: 'profile_icon' },
        { name: 'Notification', path: '/settings/notification', icon: 'notification_icon' },
        { name: 'Security', path: '/settings/security', icon: 'security_icon' },
    ]

    return (
        <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-sm min-h-screen">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-1">
                {
                    menuItems.map((item, index) => (
                        <NavLink 
                            to={item.path} 
                            key={index} 
                            end={item.path === '/settings'}
                            className={({ isActive }) => 
                                `group flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]' 
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                                        isActive 
                                            ? 'bg-white/20' 
                                            : 'bg-gray-100 group-hover:bg-white'
                                    }`}>
                                        <img src={item.icon} alt={item.name} className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-semibold">{item.name}</p>
                                </>
                            )}
                        </NavLink>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar