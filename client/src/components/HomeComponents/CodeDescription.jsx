import React from 'react'
import {assets} from '../../assets/assets.js'

const CodeDescription = () => {
    
  return (
    <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Code Management</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side of CodeDescription */}
                <div className="order-2 lg:order-1">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Merge Requests</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                    All
                                </button>
                                <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200">
                                    Pending
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Merge Request 1 - Pending */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <img src={assets.source_code_icon} alt="" className="w-10 h-10 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                                Add user authentication module
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                <span>by Sarah Chen</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* Status - Yellow for Pending */}
                                    <p>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                            Pending
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <img src={assets.file_icon} alt="" className="w-4 h-4" />
                                            <span className="font-medium">5 files</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Green for additions */}
                                            <p className="flex items-center">
                                                <span className="text-green-600 font-semibold">+234</span>
                                            </p>
                                            {/* Red for deletions */}
                                            <p className="flex items-center">
                                                <span className="text-red-600 font-semibold">-15</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                                        <img src={assets.tick_icon} alt="tick icon" className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
                                        <img src={assets.cross_icon} alt="cross icon" className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {/* Merge Request 2 - Approved */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <img src={assets.source_code_icon} alt="" className="w-10 h-10 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                                Fix responsive navbar
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                <span>by Mike Johnson</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* Status - Green for Approved */}
                                    <p>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                            Approved
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <img src={assets.file_icon} alt="" className="w-4 h-4" />
                                        <span className="font-medium">2 files</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Green for additions */}
                                        <p className="flex items-center">
                                            <span className="text-green-600 font-semibold">+45</span>
                                        </p>
                                        {/* Red for deletions */}
                                        <p className="flex items-center">
                                            <span className="text-red-600 font-semibold">-23</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Merge Request 3 - Pending */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <img src={assets.source_code_icon} alt="" className="w-10 h-10 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                                Update API endpoints
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                <span>by Alex Kumar</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* Status - Yellow for Pending */}
                                    <p>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                            Pending
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {/* Green for additions */}
                                        <p className="flex items-center">
                                            <span className="text-green-600 font-semibold">+156</span>
                                        </p>
                                        {/* Red for deletions */}
                                        <p className="flex items-center">
                                            <span className="text-red-600 font-semibold">-89</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                                        <img src={assets.tick_icon} alt="tick icon" className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
                                        <img src={assets.cross_icon} alt="cross icon" className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side of Code Description */}
                <div className="order-1 lg:order-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            GitHub-Like Version Control Built In
                        </h1>
                        <h3 className="text-lg text-gray-600 leading-relaxed">
                            Store multiple code files, create merge requests, and let team leaders approve changes. Full version control without leaving your project management system.
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                            <img src={assets.blue_tick_icon} alt="" className="w-8 h-8 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Merge Request Workflow
                                </h2>
                                <p className="text-gray-600">
                                    <span>Submit code changes for review with detailed diffs and comments</span>
                                </p>
                            </div>                   
                        </div>

                        <div className="flex gap-4 items-start bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                            <img src={assets.blue_tick_icon} alt="" className="w-8 h-8 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Team Leader Approval
                                </h2>
                                <p className="text-gray-600">
                                    <span>Leaders can review, approve, or request changes to merge requests</span>
                                </p>
                            </div>                   
                        </div>

                        <div className="flex gap-4 items-start bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                            <img src={assets.blue_tick_icon} alt="" className="w-8 h-8 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Multi-File Storage
                                </h2>
                                <p className="text-gray-600">
                                    <span>Organize and version control multiple code files in repositories</span>
                                </p>
                            </div>                   
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CodeDescription