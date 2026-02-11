import React from 'react'
import { assets } from '../../assets/assets.js'

const TeamCollaboration = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Team Collaboration
                </h2>
            </div>

            {/* Hero Description */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Empower Team Leaders & Members
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    <span>Team leaders can assign tasks to teammates, track progress in real-time, and ensure everyone stays aligned on project goals.</span>
                </p>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                
                {/* Left Structure - Team Overview */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg">
                            <img src={assets.team_icon} alt="Team icon" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Team Overview</h2>
                    </div>

                    <div className="space-y-3 mb-6">
                        {/* Team Leader */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                    <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Sarah Chen</h3>
                                    <p className="text-sm text-gray-600">
                                        <span>Team Leader</span>
                                    </p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                Leader
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Mike Johnson</h3>
                                <p className="text-sm text-gray-600">
                                    <span>Frontend Dev</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                                <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Alex Kumar</h3>
                                <p className="text-sm text-gray-600">
                                    <span>Backend Dev</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Emma Davis</h3>
                                <p className="text-sm text-gray-600">
                                    <span>UI/UX Designer</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                        <img src={assets.add_member_icon} alt="add member icon" className="w-5 h-5 brightness-0 invert" />
                        Add Team Member
                    </button>
                </div>

                {/* Right Structure - Task Assignment */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-lg">
                            <img src={assets.team_tick_icon} alt="team tick icon" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Task Assignment</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Design mockups</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={assets.team_circle_icon} alt="Team circle icon" className="w-6 h-6" />
                                    <p className="text-sm font-medium text-gray-700">
                                        <span>Emma Davis</span>
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Jan 30</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                            <h3 className="text-base font-bold text-gray-900 mb-3">API integration</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={assets.team_circle_icon} alt="Team circle icon" className="w-6 h-6" />
                                    <p className="text-sm font-medium text-gray-700">
                                        <span>Alex Kumar</span>
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Feb 1</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Component library</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={assets.team_circle_icon} alt="Team circle icon" className="w-6 h-6" />
                                    <p className="text-sm font-medium text-gray-700">
                                        <span>Mike Johnson</span>
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Feb 3</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                        <img src={assets.team_chat_icon} alt="team chat icon" className="w-5 h-5 brightness-0 invert" />
                        Assign New Task
                    </button>
                </div>
            </div>

            {/* Lower Structure - Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg flex-shrink-0">
                            <img src={assets.team_big_circle_icon} alt="team big circle icon" className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Assignment</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <span>Leaders can assign tasks based on team member expertise and availability</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg flex-shrink-0">
                            <img src={assets.team_big_chat_icon} alt="team big chat icon" className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Updates</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <span>Instant notifications when tasks are assigned or status changes</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-green-100 to-teal-100 p-3 rounded-lg flex-shrink-0">
                            <img src={assets.team_big_collaborate_icon} alt="team big collaborate icon" className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Role-Based Access</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <span>Different permissions for team leaders and members</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default TeamCollaboration