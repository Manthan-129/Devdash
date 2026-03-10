import { assets } from '../../assets/assets.js'

const LowerSection = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 px-4 relative overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
            
            {/* Top Badge */}
            <div className="flex justify-center items-center gap-2 mb-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/25">
                    <img src={assets.star_icon} alt="star icon" className="w-5 h-5 brightness-0 invert" />
                    <p className="text-white text-sm font-bold">Start Your Free Trial Today</p>
                </div>
            </div>

            {/* Main Heading */}
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
                    Ready to Transform<br/>Your Workflow?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of teams already using DevDash to manage projects, track tasks, and collaborate seamlessly.
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <button className="flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-600 text-base font-bold rounded-xl shadow-xl shadow-black/15 hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-pointer">
                    Get Started Free 
                    <img src={assets.arrow_right_icon} alt="arrow right icon" className="w-4 h-4" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-base font-bold rounded-xl border-2 border-white/25 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer">
                    Schedule a Demo
                </button>
            </div>

            {/* Feature List */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                        <img src={assets.tick_icon} alt="tick icon" className="w-3 h-3 brightness-0 invert" />
                    </div>
                    <p className="font-medium">No credit card required</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                        <img src={assets.tick_icon} alt="tick icon" className="w-3 h-3 brightness-0 invert" />
                    </div>
                    <p className="font-medium">14-day free trial</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                        <img src={assets.tick_icon} alt="tick icon" className="w-3 h-3 brightness-0 invert" />
                    </div>
                    <p className="font-medium">Cancel anytime</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default LowerSection