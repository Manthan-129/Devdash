import { assets } from '../../assets/assets.js'

const CodeDescription = () => {
    
  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50/50 py-20 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-40 right-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
            {/* Section Title */}
            <div className="text-center mb-14">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/80 text-blue-700 text-sm font-semibold rounded-full border border-blue-200/50 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Kanban Workflow
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Visual Task Management</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side — Kanban Board Preview */}
                <div className="order-2 lg:order-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-7 md:p-8 border border-white/50 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold">12 Tasks</span>
                            </div>
                        </div>

                        {/* Mini Kanban Columns */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* To-Do Column */}
                            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-xs font-bold text-slate-600">To-Do</span>
                                    <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">4</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-800 mb-1">Design landing page</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100">high</span>
                                            <span className="text-[10px] text-gray-400">Jan 25</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-800 mb-1">Setup database</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">med</span>
                                            <span className="text-[10px] text-gray-400">Jan 28</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress Column */}
                            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold text-blue-600">In Progress</span>
                                    <span className="ml-auto text-[10px] font-bold bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-md">3</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-800 mb-1">Build auth system</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100">high</span>
                                            <span className="text-[10px] text-gray-400">Jan 30</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-800 mb-1">API integration</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">low</span>
                                            <span className="text-[10px] text-gray-400">Feb 1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Done Column */}
                            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-emerald-600">Done</span>
                                    <span className="ml-auto text-[10px] font-bold bg-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md">5</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-emerald-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-400 line-through mb-1">Project setup</p>
                                        <span className="text-[10px] text-emerald-500 font-medium">Completed</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-emerald-100 hover:shadow-md transition-all">
                                        <p className="text-xs font-semibold text-gray-400 line-through mb-1">Wire-frames</p>
                                        <span className="text-[10px] text-emerald-500 font-medium">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side — Feature Description */}
                <div className="order-1 lg:order-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                            Drag, Drop & Deliver — Kanban Made Simple
                        </h1>
                        <h3 className="text-lg text-gray-600 leading-relaxed">
                            Visualize your workflow with intuitive Kanban boards. Move tasks through stages, filter by priority or team member, and keep everyone aligned.
                        </h3>
                    </div>

                    <div className="space-y-5">
                        {[
                            { title: 'Multi-Column Boards', desc: 'Organize tasks into To-Do, In Progress, In Review, and Done columns' },
                            { title: 'Priority & Filters', desc: 'Filter tasks by priority level or team member to focus on what matters' },
                            { title: 'Pull Request Tracking', desc: 'Link GitHub pull requests to tasks and track review status in real-time' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-blue-100/80 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                <img src={assets.blue_tick_icon} alt="" className="w-8 h-8 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>                   
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CodeDescription