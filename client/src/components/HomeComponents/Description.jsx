import { assets } from '../../assets/assets.js'

const Description = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 mb-5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Platform Features
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Everything You Need in One Platform
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    DevDash brings together the best of project management, team collaboration, and pull request tracking — designed for modern development teams.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
                {[
                    { title: 'Task Scheduling', desc: 'Organize present and future tasks with intelligent scheduling and deadline management', icon: assets.task_scheduling_icon, gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
                    { title: 'Progress Tracking', desc: 'Real-time progress bars showing team member completion status and productivity metrics', icon: assets.task_scheduling_icon, gradient: 'from-emerald-50 to-teal-50', border: 'border-emerald-100' },
                    { title: 'Pull Request Tracking', desc: 'Link GitHub PRs to tasks, track review status, and manage code reviews from your dashboard', icon: assets.task_scheduling_icon, gradient: 'from-violet-50 to-purple-50', border: 'border-violet-100' },
                    { title: 'Instant Collaboration', desc: 'Real-time updates and notifications keep your entire team synchronized', icon: assets.task_scheduling_icon, gradient: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
                    { title: 'Friends & Connections', desc: 'Send friend requests, manage connections, and build your developer social network', icon: assets.task_scheduling_icon, gradient: 'from-rose-50 to-pink-50', border: 'border-rose-100' },
                    { title: 'Remote-First', desc: 'Built for distributed teams with cloud-based access from anywhere', icon: assets.task_scheduling_icon, gradient: 'from-cyan-50 to-sky-50', border: 'border-cyan-100' },
                ].map((feature, i) => (
                    <div key={i} className={`group bg-gradient-to-br ${feature.gradient} p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border ${feature.border} hover:-translate-y-1`}>
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <img src={feature.icon} alt="" className="w-7 h-7" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Task Management Section */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-sm border border-blue-100/50">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                        Core Feature
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Task Management</h1>
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
                        <div className="space-y-5">
                            <div className="flex gap-4 items-start bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm hover:shadow-md transition-all">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 mb-1">Smart Prioritization</h2>
                                    <p className="text-gray-600 text-sm">Automatically prioritize tasks based on deadlines and dependencies</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm hover:shadow-md transition-all">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 mb-1">Timeline View</h2>
                                    <p className="text-gray-600 text-sm">Visualize tasks on a timeline to plan for the present and future</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm hover:shadow-md transition-all">
                                <img src={assets.check_icon} alt="check icon" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 mb-1">Custom Workflows</h2>
                                    <p className="text-gray-600 text-sm">Create custom statuses and workflows that match your team's process</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side of Description */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors">
                                View All
                            </button>  
                        </div>
                        <div className="space-y-3">
                            {/* Completed Task - with line-through */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="line-through text-gray-400">Design the landing page</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">high</span>
                                    <span className="text-xs text-gray-400">Jan 25</span>
                                </div>
                            </div>
                            
                            {/* Active Task - High Priority */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.clock_icon} alt="clock icon" className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-gray-900 font-semibold">Implement authentication</p>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">high</span>
                                    <span className="text-xs text-gray-400">Jan 28</span>
                                </div>
                            </div>
                            
                            {/* Active Task - Medium Priority */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-gray-900 font-semibold">Fix responsive issues</p>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">medium</span>
                                    <span className="text-xs text-gray-400">Jan 30</span>
                                </div>
                            </div>
                            
                            {/* Active Task - Low Priority */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-gray-900 font-semibold">Update documentation</p>
                                </div>
                                <div className="flex gap-2 items-center ml-4">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100">low</span>
                                    <span className="text-xs text-gray-400">Feb 2</span>
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