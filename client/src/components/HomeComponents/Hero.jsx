// Hero.jsx
import { useContext } from 'react';
import { assets } from '../../assets/assets.js';
import { AppContext } from '../../context/AppContext.jsx';

const Hero = () => {

    const {navigate}= useContext(AppContext);

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 px-4 overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

            {/* Top Badge */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/25 shadow-lg shadow-black/5">
                    <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
                    Project Management + Team Collaboration
                </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                    Welcome to <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">DevDash</span>
                </h1>

                <p className="text-lg sm:text-xl text-white/85 max-w-3xl mx-auto leading-relaxed">
                    The ultimate platform for managing tasks with Kanban boards, collaborating with your team, tracking pull requests, and building connections — all in one place.
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                    onClick={() => navigate('/signup')} 
                    className="px-8 py-3.5 bg-white text-indigo-600 text-sm font-bold rounded-xl hover:bg-cyan-50 transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg"
                >
                    Get Started Free
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm font-bold rounded-xl border border-white/25 hover:bg-white/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                    Sign In to Dashboard
                </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">

                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                    <div className="flex justify-center items-center mb-4 h-14">
                        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all group-hover:scale-110">
                            <img src={assets.task_icon} alt="Task icon" className="w-7 h-7 object-contain brightness-0 invert" />
                        </div>
                    </div>
                    <p className="text-white text-base font-bold mb-1">Task Management</p>
                    <p className="text-white/60 text-xs">Organize and track all your tasks</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                    <div className="flex justify-center items-center mb-4 h-14">
                        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all group-hover:scale-110">
                            <img src={assets.team_icon} alt="Team icon" className="w-7 h-7 object-contain brightness-0 invert" />
                        </div>
                    </div>
                    <p className="text-white text-base font-bold mb-1">Team Collaboration</p>
                    <p className="text-white/60 text-xs">Work together seamlessly</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                    <div className="flex justify-center items-center mb-4 h-14">
                        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all group-hover:scale-110">
                            <img src={assets.code_icon} alt="Code icon" className="w-7 h-7 object-contain brightness-0 invert" />
                        </div>
                    </div>
                    <p className="text-white text-base font-bold mb-1">PR Tracking</p>
                    <p className="text-white/60 text-xs">Link and review GitHub pull requests</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
                    <div className="flex justify-center items-center mb-4 h-14">
                        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all group-hover:scale-110">
                            <img src={assets.version_icon} alt="Friends icon" className="w-7 h-7 object-contain brightness-0 invert" />
                        </div>
                    </div>
                    <p className="text-white text-base font-bold mb-1">Friends & Social</p>
                    <p className="text-white/60 text-xs">Connect and collaborate with peers</p>
                </div>

            </div>

            {/* Trust indicator */}
            <div className="flex items-center justify-center gap-6 mt-12 text-white/50 text-xs">
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>Free forever</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>Unlimited teams</span>
                </div>
            </div>

        </div>

    </div>
  )
}

export default Hero