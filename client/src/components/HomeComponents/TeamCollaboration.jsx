import { assets } from '../../assets/assets.js'

const TeamCollaboration = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
            
            {/* Section Header */}
            <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/80 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-200/50 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Collaboration
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Team Collaboration
                </h2>
            </div>

            {/* Hero Description */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Empower Team Leaders & Members
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Team leaders can assign tasks to teammates, track progress in real-time, and ensure everyone stays aligned on project goals.
                </p>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                
                {/* Left Structure - Team Overview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-200">
                            <img src={assets.team_icon} alt="Team icon" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Team Overview</h2>
                    </div>

                    <div className="space-y-3 mb-6">
                        {/* Team Leader */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Sarah Chen</h3>
                                    <p className="text-sm text-gray-600">Team Leader</p>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm">
                                Leader
                            </div>
                        </div>

                        {/* Team Members */}
                        {[
                            { name: 'Mike Johnson', role: 'Frontend Dev', gradient: 'from-purple-400 to-pink-400' },
                            { name: 'Alex Kumar', role: 'Backend Dev', gradient: 'from-green-400 to-teal-400' },
                            { name: 'Emma Davis', role: 'UI/UX Designer', gradient: 'from-orange-400 to-red-400' },
                        ].map((member, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white/70 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className={`w-10 h-10 bg-gradient-to-br ${member.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                                    <img src={assets.raw_icon} alt="raw icon" className="w-5 h-5 brightness-0 invert" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all">
                        <img src={assets.add_member_icon} alt="add member icon" className="w-5 h-5 brightness-0 invert" />
                        Add Team Member
                    </button>
                </div>

                {/* Right Structure - Task Assignment */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-md shadow-purple-200">
                            <img src={assets.team_tick_icon} alt="team tick icon" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Task Assignment</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        {[
                            { task: 'Design mockups', person: 'Emma Davis', date: 'Jan 30', gradient: 'from-purple-50 to-pink-50', border: 'border-purple-100' },
                            { task: 'API integration', person: 'Alex Kumar', date: 'Feb 1', gradient: 'from-green-50 to-teal-50', border: 'border-green-100' },
                            { task: 'Component library', person: 'Mike Johnson', date: 'Feb 3', gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 bg-gradient-to-r ${item.gradient} rounded-2xl border ${item.border} hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                                <h3 className="text-base font-bold text-gray-900 mb-3">{item.task}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={assets.team_circle_icon} alt="Team circle icon" className="w-6 h-6" />
                                        <p className="text-sm font-medium text-gray-700">{item.person}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 font-semibold bg-white/60 px-2.5 py-0.5 rounded-lg">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
                        <img src={assets.team_chat_icon} alt="team chat icon" className="w-5 h-5 brightness-0 invert" />
                        Assign New Task
                    </button>
                </div>
            </div>

            {/* Lower Structure - Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Smart Assignment', desc: 'Leaders can assign tasks based on team member expertise and availability', icon: assets.team_big_circle_icon, gradient: 'from-blue-100 to-indigo-100' },
                    { title: 'Real-Time Updates', desc: 'Instant notifications when tasks are assigned or status changes', icon: assets.team_big_chat_icon, gradient: 'from-purple-100 to-pink-100' },
                    { title: 'Role-Based Access', desc: 'Different permissions for team leaders and members', icon: assets.team_big_collaborate_icon, gradient: 'from-green-100 to-teal-100' },
                ].map((card, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-start gap-4">
                            <div className={`bg-gradient-to-br ${card.gradient} p-3.5 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                                <img src={card.icon} alt="" className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </div>
  )
}

export default TeamCollaboration