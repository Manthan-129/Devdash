// Navbar.jsx
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets.js'
import { AppContext } from '../../context/AppContext.jsx'

const Navbar = () => {

    const { token, user, logoutUser, navigate }= useContext(AppContext);

    const [showDropDown, setShowDropDown]= useState(false);
    const [mobileMenuOpen, setMobileMenuOpen]= useState(false);
    const [scrolled, setScrolled]= useState(false);
    const dropDownRef= useRef(null);

    useEffect(()=>{
        const handleScroll= ()=>{
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return ()=> window.removeEventListener('scroll', handleScroll);
    },[]);

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100' : 'bg-white/80 backdrop-blur-md border-b border-gray-100/50'}`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-between h-16">

                {/* Logo Section — matching dashboard style */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-200/60">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                            Dev<span className="text-blue-600">Dash</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 font-medium -mt-0.5 hidden sm:block">Project Management</p>
                    </div>
                </Link>

                {/* Center Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                    <a href="#features" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Features</a>
                    <a href="#collaboration" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Collaboration</a>
                    <a href="#tracking" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Tracking</a>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2.5">

                    {token ? (
                        <>
                            {/* Dashboard Button */}
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer border border-gray-200 hover:border-blue-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Dashboard
                            </button>

                            {/* User Dropdown */}
                            <div className="relative" ref={dropDownRef}>
                                <button 
                                    onClick={() => setShowDropDown(!showDropDown)}
                                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                                        <img src={user?.profilePicture ?? assets.user_icon} alt="user icon" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-gray-700 text-sm font-semibold hidden sm:block max-w-[100px] truncate">{user?.firstName ?? "N/A"}</span>
                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showDropDown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropDown && (
                                    <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl shadow-black/12 border border-gray-100 overflow-hidden z-50 animate-fadeIn">

                                        {/* User details */}
                                        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-white shadow-sm">
                                                    <img src={user?.profilePicture ?? assets.user_icon} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName ?? "N/A"} {user?.lastName ?? "N/A"}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email ?? "N/A"}</p>
                                                </div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-100 shrink-0"></div>
                                            </div>
                                        </div>

                                        {/* Menu Options */}
                                        <div className="py-2 px-2">
                                            <button 
                                                onClick={()=> { setShowDropDown(false); navigate('/dashboard'); }}
                                                className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                </div>
                                                <span className="text-gray-700 text-sm font-medium">Dashboard</span>
                                            </button>
                                            <button 
                                                onClick={()=> { setShowDropDown(false); navigate('/settings'); }}
                                                className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <span className="text-gray-700 text-sm font-medium">Profile Settings</span>
                                            </button>
                                        </div>

                                        {/* Logout Button */}
                                        <div className="border-t border-gray-100 px-2 py-2">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full px-3 py-2.5 text-left hover:bg-red-50 transition-all flex items-center gap-3 cursor-pointer rounded-xl group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
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
                        <div className="hidden md:flex items-center gap-2.5">

                            <button 
                                onClick={()=> navigate('/login')}
                                className="px-5 py-2 text-gray-600 text-sm font-semibold hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                            >
                                Login
                            </button>

                            <button 
                                onClick={()=> navigate('/signup')}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200/60 hover:shadow-lg hover:shadow-blue-300/60 transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                Sign Up
                            </button>

                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        )}
                    </button>

                </div>

            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 py-4 space-y-2 animate-fadeIn">
                    <a href="#features" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Features</a>
                    <a href="#collaboration" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Collaboration</a>
                    <a href="#tracking" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">Tracking</a>
                    {token ? (
                        <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
                            <button onClick={()=> { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Dashboard
                            </button>
                            <button onClick={()=> { setMobileMenuOpen(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Settings
                            </button>
                            <button onClick={()=> { setMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2 px-4">
                            <button onClick={()=> { setMobileMenuOpen(false); navigate('/login'); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">Login</button>
                            <button onClick={()=> { setMobileMenuOpen(false); navigate('/signup'); }} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-200/60 cursor-pointer">Sign Up</button>
                        </div>
                    )}
                </div>
            )}

        </div>

    </nav>

  )
}

export default Navbar