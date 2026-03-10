// Navbar.jsx
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets.js'
import { AppContext } from '../../context/AppContext.jsx'

const Navbar = () => {

    const { token, user, logoutUser, navigate }= useContext(AppContext);

    const [showDropDown, setShowDropDown]= useState(false);
    const dropDownRef= useRef(null);

    useEffect(()=>{
        const handleClickOutside= (event)=>{
            if(dropDownRef.current && !dropDownRef.current.contains(event.target)){
                setShowDropDown(false);
            }
        }

        if(showDropDown){
            document.addEventListener('mousedown', handleClickOutside);
        }

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[showDropDown]);

    const handleLogout=()=>{
        setShowDropDown(false);
        logoutUser();
    }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/10 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-between h-16">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/25 hover:bg-white/25 transition-all">
                        <h1 className="text-xl font-extrabold text-white tracking-tight">
                            Dev<span className="text-cyan-200">Dash</span>
                        </h1>
                    </div>
                </Link>

                <div className="flex items-center gap-3">

                    {token ? (
                        <>
                            {/* Dashboard Button */}
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 text-white text-sm font-semibold hover:bg-white/15 rounded-xl transition-all border border-white/20 hover:border-white/40 cursor-pointer backdrop-blur-sm"
                            >
                                Dashboard
                            </button>

                            {/* User Dropdown */}
                            <div className="relative" ref={dropDownRef}>
                                {/* User Avatar Button */}
                                <button 
                                    onClick={() => setShowDropDown(!showDropDown)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white/25 transition-all cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                                        <img src={user?.profilePicture ?? assets.user_icon} alt="user icon" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-white text-sm font-semibold hidden sm:block">{user?.firstName ?? "N/A"}</span>
                                    <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${showDropDown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropDown && (
                                    <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden z-50 animate-fadeIn">

                                        {/* User details */}
                                        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-white shadow-sm">
                                                    <img src={user?.profilePicture ?? assets.user_icon} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{user?.firstName ?? "N/A"} {user?.lastName ?? "N/A"}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{user?.email ?? "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Options */}
                                        <div className="py-2 px-2">
                                            <button 
                                                onClick={()=> { setShowDropDown(false); navigate('/dashboard'); }}
                                                className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                </div>
                                                <span className="text-gray-700 text-sm font-medium">Dashboard</span>
                                            </button>
                                            <button 
                                                onClick={()=> { setShowDropDown(false); navigate('/settings'); }}
                                                className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <span className="text-gray-700 text-sm font-medium">Profile Settings</span>
                                            </button>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="border-t border-gray-100 px-2 py-2">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full px-3 py-2.5 text-left hover:bg-red-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                </div>
                                                <span className="text-red-600 text-sm font-semibold">Logout</span>
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">

                            <button 
                                onClick={()=> navigate('/login')}
                                className="px-5 py-2 text-white text-sm font-semibold hover:bg-white/15 rounded-xl transition-all cursor-pointer"
                            >
                                Login
                            </button>

                            <button 
                                onClick={()=> navigate('/signup')}
                                className="px-5 py-2.5 bg-white text-indigo-600 text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                Sign Up Free
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </div>

    </nav>

  )
}

export default Navbar