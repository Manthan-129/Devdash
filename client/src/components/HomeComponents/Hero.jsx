// Hero.jsx
import React, { useContext } from 'react'
import {assets} from '../../assets/assets.js'
import {AppContext} from '../../context/AppContext.jsx'

const Hero = () => {

    const {navigate}= useContext(AppContext);

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20 px-4">

        <div className="max-w-7xl mx-auto">

            {/* Top Badge */}
            <div className="flex justify-center mb-8">
                <div className="inline-block px-5 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                    Project Management + Version Control
                </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-10">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Welcome to <span className="text-cyan-300">DevDash</span>
                </h1>

                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    The ultimate platform combining powerful project management with GitHub-like version control. Manage tasks, collaborate with your team, and version your code—all in one place.
                </p>
            </div>


            <button onClick={()=> navigate('/workplace')} className="flex mx-auto mb-10 px-8 py-3 bg-white text-indigo-600 text-sm font-semibold rounded-full hover:bg-cyan-300 hover:text-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">Explore Our DevDash</button>
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                    <div className="flex justify-center items-center mb-3 h-14">
                        <img src={assets.task_icon} alt="Task icon" className="max-w-full max-h-full object-contain brightness-0 invert" />
                    </div>
                    <p className="text-white text-base font-semibold">Task Management</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                    <div className="flex justify-center items-center mb-3 h-14">
                        <img src={assets.team_icon} alt="Team icon" className="max-w-full max-h-full object-contain brightness-0 invert" />
                    </div>
                    <p className="text-white text-base font-semibold">Team Collaboration</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                    <div className="flex justify-center items-center mb-3 h-14">
                        <img src={assets.code_icon} alt="Code icon" className="max-w-full max-h-full object-contain brightness-0 invert" />
                    </div>
                    <p className="text-white text-base font-semibold">Code Management</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                    <div className="flex justify-center items-center mb-3 h-14">
                        <img src={assets.version_icon} alt="Version icon" className="max-w-full max-h-full object-contain brightness-0 invert" />
                    </div>
                    <p className="text-white text-base font-semibold">Version Control</p>
                </div>

            </div>

        </div>

    </div>
  )
}

export default Hero