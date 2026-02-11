import React from 'react'
import { assets } from '../../assets/assets.js'
import { Line } from 'rc-progress'

const ProgressTracking = () => {
  return (
    <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-block px-5 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200 mb-4">
                    <span>Progress Tracking</span>
                </div>
            </div>

            {/* Hero Description */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Real-Time Team Progress Visualization
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    <span>Monitor team member progress with beautiful, intuitive progress bars. See who's ahead, who needs help, and keep projects on track.</span>
                </p>
            </div>

            {/* Main Progress Component */}
            <div className="mb-16">
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-gray-200">
                    
                    {/* Header with Filters */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Team Progress</h2>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                This Week
                            </button>
                            <button className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                This Month
                            </button>
                        </div>
                    </div>

                    {/* Progress Cards */}
                    <div className="space-y-6">
                        
                        {/* Sarah Chen */}
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                        <img src={assets.raw_icon} alt="raw icon" className="w-6 h-6 brightness-0 invert" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Sarah Chen</h3> 
                                        <p className="text-sm text-gray-600">Team Leader</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-green-600">92%</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">11/12</span> tasks
                                    </p>
                                </div>
                            </div>
                            <Line 
                                strokeWidth={1} 
                                percent={(11/12)*100} 
                                strokeColor="#10b981"
                                trailColor="#e5e7eb"
                                className="rounded-full"
                            />
                        </div>

                        {/* Mike Johnson */}
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md">
                                        <img src={assets.raw_icon} alt="raw icon" className="w-6 h-6 brightness-0 invert" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Mike Johnson</h3> 
                                        <p className="text-sm text-gray-600">Frontend Dev</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-yellow-600">78%</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">7/9</span> tasks
                                    </p>
                                </div>
                            </div>
                            <Line 
                                strokeWidth={1} 
                                percent={(7/9)*100} 
                                strokeColor="#eab308"
                                trailColor="#e5e7eb"
                                className="rounded-full"
                            />
                        </div>

                        {/* Alex Kumar */}
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center shadow-md">
                                        <img src={assets.raw_icon} alt="raw icon" className="w-6 h-6 brightness-0 invert" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Alex Kumar</h3> 
                                        <p className="text-sm text-gray-600">Backend Dev</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-green-600">85%</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">9/11</span> tasks
                                    </p>
                                </div>
                            </div>
                            <Line 
                                strokeWidth={1} 
                                percent={(9/11)*100} 
                                strokeColor="#10b981"
                                trailColor="#e5e7eb"
                                className="rounded-full"
                            />
                        </div>

                        {/* Emma Davis */}
                        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-md">
                                        <img src={assets.raw_icon} alt="raw icon" className="w-6 h-6 brightness-0 invert" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Emma Davis</h3> 
                                        <p className="text-sm text-gray-600">UI/UX Designer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-green-600">95%</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">10/10</span> tasks
                                    </p>
                                </div>
                            </div>
                            <Line 
                                strokeWidth={1} 
                                percent={(10/10)*100} 
                                strokeColor="#10b981"
                                trailColor="#e5e7eb"
                                className="rounded-full"
                            />
                        </div>

                        {/* Overall Team Progress */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 p-2.5 rounded-lg">
                                    <img src={assets.batch_icon} alt="batch icon" className="w-6 h-6 brightness-0 invert" />
                                </div>
                                <h3 className="text-xl font-bold">Overall Team Progress</h3> 
                            </div>
                             
                            <div className="mb-4">
                                <Line 
                                    strokeWidth={2} 
                                    percent={87} 
                                    strokeColor="#ffffff"
                                    trailColor="rgba(255,255,255,0.2)"
                                    className="rounded-full"
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <p className="text-white/90 text-sm">
                                    <span className="font-semibold">37 of 43</span> total tasks completed this month
                                </p>
                                <h3 className="text-4xl font-bold">87%</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg">
                            <img src={assets.circular_batch_icon} alt="circular_batch_icon" className="w-10 h-10 brightness-0 invert" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-bold text-blue-600 mb-2">43</h2>
                    <h3 className="text-lg font-semibold text-gray-700">Active Tasks</h3>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 text-center shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-full shadow-lg">
                            <img src={assets.growth_icon} alt="growth icon" className="w-10 h-10 brightness-0 invert" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-bold text-green-600 mb-2">87%</h2>
                    <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full shadow-lg">
                            <img src={assets.batch_icon} alt="batch icon" className="w-10 h-10 brightness-0 invert" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-bold text-purple-600 mb-2">12</h2>
                    <h3 className="text-lg font-semibold text-gray-700">Projects Delivered</h3>
                </div>

            </div>

        </div>
    </div>
  )
}

export default ProgressTracking