// Hero.jsx
import { assets } from '../../assets/assets.js';

const Hero = () => {

  return (
    <div className="relative bg-gradient-to-b from-white via-blue-50/50 to-indigo-50/30 py-28 px-4 overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

            {/* Top Badge */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Project Management + Team Collaboration
                </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                    Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DevDash</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                    The ultimate platform for managing tasks with Kanban boards, collaborating with your team, tracking pull requests, and building connections — all in one place.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">

                {[
                    { icon: assets.task_icon, title: 'Task Management', desc: 'Organize and track all your tasks', gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-100', iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
                    { icon: assets.team_icon, title: 'Team Collaboration', desc: 'Work together seamlessly', gradient: 'from-violet-50 to-purple-50', border: 'border-violet-100', iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600' },
                    { icon: assets.code_icon, title: 'PR Tracking', desc: 'Link and review GitHub pull requests', gradient: 'from-amber-50 to-orange-50', border: 'border-amber-100', iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600' },
                    { icon: assets.version_icon, title: 'Friends & Social', desc: 'Connect and collaborate with peers', gradient: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
                ].map((card, i) => (
                    <div key={i} className={`group bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-center border ${card.border} hover:shadow-xl transition-all hover:-translate-y-1`}>
                        <div className="flex justify-center items-center mb-4 h-14">
                            <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                <img src={card.icon} alt="" className="w-7 h-7 object-contain brightness-0 invert" />
                            </div>
                        </div>
                        <p className="text-gray-900 text-base font-bold mb-1">{card.title}</p>
                        <p className="text-gray-500 text-xs">{card.desc}</p>
                    </div>
                ))}

            </div>

            {/* Trust indicator */}
            <div className="flex items-center justify-center gap-6 mt-12 text-gray-400 text-xs">
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>Free forever</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    <span>Unlimited teams</span>
                </div>
            </div>

        </div>

    </div>
  )
}

export default Hero