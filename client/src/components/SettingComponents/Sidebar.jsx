import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowLeft, Bell, ChevronRight, Lock, LogOut, Sparkles, User } from 'lucide-react'
import { AppContext } from '../../context/AppContext.jsx'

const Sidebar = () => {
    const { user, logoutUser } = useContext(AppContext);

    const menuItems = [
        { name: 'Profile', path: '/settings', icon: User, accent: 'from-blue-500 to-indigo-500' },
        { name: 'Security', path: '/settings/security', icon: Lock, accent: 'from-amber-500 to-orange-500' },
        { name: 'Notifications', path: '/settings/notification', icon: Bell, accent: 'from-emerald-500 to-teal-500' },
    ]

    return (
        <aside className="w-[272px] bg-white border-r border-gray-100 flex flex-col shadow-sm">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-50">
                <NavLink to="/" className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-200">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Dev<span className="text-blue-600">Dash</span></h1>
                        <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Settings</p>
                    </div>
                </NavLink>
            </div>

            {/* Back to Dashboard */}
            <div className="px-3 pt-4 pb-2">
                <NavLink
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all group"
                >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all">
                        <ArrowLeft size={16} className="text-gray-500" />
                    </div>
                    Back to Dashboard
                </NavLink>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Settings</p>
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/settings'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                isActive
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? `bg-gradient-to-br ${item.accent} shadow-sm` : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                    <item.icon size={16} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} />
                                </div>
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRight size={14} className="text-blue-400" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-gray-50 p-3">
                <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer group"
                >
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all">
                        <LogOut size={16} className="text-red-500" />
                    </div>
                    Logout
                </button>
            </div>

            {/* User info */}
            {user && (
                <div className="border-t border-gray-50 px-4 py-4">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3 border border-gray-100">
                        <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff`}
                            alt="avatar"
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-100 shrink-0"></div>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar