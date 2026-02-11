import React from 'react'
import {assets} from '../../assets/assets.js'

const Description = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Everything You Need in One Platform
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    DevDash brings together the best of project management and version control, designed for modern development teams.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Scheduling</h2>
                        <p className="text-gray-600">Organize present and future tasks with intelligent scheduling and deadline management</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h2>
                        <p className="text-gray-600">Real-time progress bars showing team member completion status and productivity metrics</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Secure Code Storage</h2>
                        <p className="text-gray-600">Store multiple code files securely with enterprise-grade encryption and backup</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Instant Collaboration</h2>
                        <p className="text-gray-600">Real-time updates and notifications keep your entire team synchronized</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Time Tracking</h2>
                        <p className="text-gray-600">Automatic time tracking for tasks and projects to improve estimations</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <img src={assets.task_scheduling_icon} alt="task Scheduling icon" className="w-12 h-12 mb-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Remote-First</h2>
                        <p className="text-gray-600">Built for distributed teams with cloud-based access from anywhere</p>
                    </div>
                </div>
            </div>

            {/* Task Management Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Task Management</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side of Description */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Manage Present & Future Tasks Effortlessly
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Keep track of all your tasks with intuitive organization. Prioritize work, set deadlines, and ensure nothing falls through the cracks.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Smart Prioritization</h2>
                                    <p className="text-gray-600">Automatically priortize tasks based on deadlines and dependencies</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Timeline view</h2>
                                    <p className="text-gray-600">Visualize tasks on a timeline to plan for the present and future</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-1 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Custom Workflows</h2>
                                    <p className="text-gray-600">Create custom statuses and workflows that match your team's process</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side of Description */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors">
                                View All
                            </button>  
                        </div>
                        <div className="space-y-4">
                            {/* Completed Task - with line-through */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="line-through text-gray-500">Design the landing page</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <p>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            high
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-sm text-gray-500">Jan 25</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Active Task - High Priority */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.clock_icon} alt="clock icon" className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">Implement authentication</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <p>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            high
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-sm text-gray-500">Jan 28</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Active Task - Medium Priority */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">Fix responsive issuese</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <p>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                            medium
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-sm text-gray-500">Jan 30</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Active Task - Low Priority */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">Update documentation</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <p>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            low
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-sm text-gray-500">Feb 2</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Description