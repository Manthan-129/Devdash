import { Line } from 'rc-progress'
import { assets } from '../../assets/assets.js'

const members = [
    { name: 'Sarah Chen', role: 'Team Leader', done: 11, total: 12, gradient: 'from-blue-400 to-indigo-500', color: '#10b981' },
    { name: 'Mike Johnson', role: 'Frontend Dev', done: 7, total: 9, gradient: 'from-purple-400 to-pink-400', color: '#eab308' },
    { name: 'Alex Kumar', role: 'Backend Dev', done: 9, total: 11, gradient: 'from-green-400 to-teal-400', color: '#10b981' },
    { name: 'Emma Davis', role: 'UI/UX Designer', done: 10, total: 10, gradient: 'from-orange-400 to-red-400', color: '#10b981' },
]

const stats = [
    { icon: assets.circular_batch_icon, value: '43', label: 'Active Tasks', gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100', text: 'text-blue-600' },
    { icon: assets.growth_icon, value: '87%', label: 'Completion Rate', gradient: 'from-green-500 to-teal-600', bg: 'from-green-50 to-teal-50', border: 'border-green-100', text: 'text-green-600' },
    { icon: assets.batch_icon, value: '12', label: 'Projects Delivered', gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', text: 'text-purple-600' },
]

const ProgressTracking = () => {
  return (
    <div id="tracking" className="w-full bg-gradient-to-b from-gray-50/50 to-white py-20 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
            
            {/* Section Header */}
            <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100/80 text-green-700 text-sm font-semibold rounded-full border border-green-200/50 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Progress Tracking
                </span>
            </div>

            {/* Hero Description */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Real-Time Team Progress Visualization
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Monitor team member progress with beautiful, intuitive progress bars. See who's ahead, who needs help, and keep projects on track.
                </p>
            </div>

            {/* Main Progress Component */}
            <div className="mb-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                    
                    {/* Header with Filters */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Team Progress</h2>
                        <div className="flex gap-2">
                            <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-blue-200 transition-all">
                                This Week
                            </button>
                            <button className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                                This Month
                            </button>
                        </div>
                    </div>

                    {/* Progress Cards */}
                    <div className="space-y-4">
                        {members.map((m, i) => {
                            const pct = Math.round((m.done / m.total) * 100)
                            return (
                                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${m.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                                                <img src={assets.raw_icon} alt="" className="w-6 h-6 brightness-0 invert" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{m.name}</h3> 
                                                <p className="text-sm text-gray-500">{m.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-2xl font-bold" style={{ color: m.color }}>{pct}%</h3>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">{m.done}/{m.total}</span> tasks
                                            </p>
                                        </div>
                                    </div>
                                    <Line 
                                        strokeWidth={1} 
                                        percent={pct} 
                                        strokeColor={m.color}
                                        trailColor="#f3f4f6"
                                        className="rounded-full"
                                    />
                                </div>
                            )
                        })}

                        {/* Overall Team Progress */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-600/20 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                    <img src={assets.batch_icon} alt="" className="w-6 h-6 brightness-0 invert" />
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
                {stats.map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl p-8 text-center shadow-sm border ${s.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                        <div className="flex justify-center mb-4">
                            <div className={`bg-gradient-to-br ${s.gradient} p-4 rounded-2xl shadow-lg`}>
                                <img src={s.icon} alt="" className="w-10 h-10 brightness-0 invert" />
                            </div>
                        </div>
                        <h2 className={`text-5xl font-extrabold ${s.text} mb-2`}>{s.value}</h2>
                        <h3 className="text-lg font-semibold text-gray-700">{s.label}</h3>
                    </div>
                ))}
            </div>

        </div>
    </div>
  )
}

export default ProgressTracking