// Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react'
import {assets} from '../../assets/assets.js'
import {AppContext} from '../../context/AppContext.jsx'
import { Link } from 'react-router-dom'

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
    <nav className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-between h-16">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                        <h1 className="text-xl font-bold text-white">
                            Dev<span className="text-cyan-200">Dash</span>
                        </h1>
                    </div>
                </Link>

                <div className="flex items-center gap-3">

                    {token ? (
                        <>
                            {/* Dashboard Button
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 text-white text-sm font-medium hover:bg-white/20 rounded-lg transition-colors border border-white/30"
                            >
                                Dashboard
                            </button> */}

                            {/* User Dropdown */}
                            <div className="relative" ref={dropDownRef}>
                                {/* User Avatar Button */}
                                <button 
                                    onClick={() => setShowDropDown(!showDropDown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img src={user?.profilePicture ?? assets.user_icon} alt="user icon" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-white text-sm font-medium hidden sm:block">{user?.firstName ?? "N/A"}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropDown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">

                                        {/* User details */}
                                        <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                                            <p className="text-sm font-bold text-gray-900">{user?.firstName ?? "N/A"} {user?.lastName ?? "N/A"}</p>
                                            <p className="text-xs text-gray-600 mt-1">{user?.email ?? "N/A"}</p>
                                        </div>

                                        {/* Menu Options */}
                                        <div className="py-2">
                                            <button 
                                                onClick={()=> navigate('/settings')}
                                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                            >
                                                <span className="text-gray-700 text-sm font-medium"><img src={assets.settings_icon} alt="settings icon" /> Profile Settings</span>
                                            </button>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="border-t border-gray-200">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                                            >
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
                                className="px-5 py-2 text-white text-sm font-medium hover:bg-white/20 rounded-lg transition-colors"
                            >
                                Login
                            </button>

                            <button 
                                onClick={()=> navigate('/signup')}
                                className="px-5 py-2 bg-white text-blue-600 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                Sign Up
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