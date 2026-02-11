import React from 'react'
import { assets } from '../../assets/assets.js'

const LowerSection = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
            
            {/* Top Badge */}
            <div className="flex justify-center items-center gap-2 mb-6">
                <img src={assets.star_icon} alt="star icon" className="w-6 h-6 brightness-0 invert" />
                <p className="text-white text-sm font-semibold">
                    <span>Start Your Free Trial Today</span>
                </p>
            </div>

            {/* Main Heading */}
            <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Ready to Transform Your Workflow?
                </h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of teams already using DevDash to manage projects and collaborate on code seamlessly.
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    Get Started Free 
                    <img src={assets.arrow_right_icon} alt="arrow right icon" className="w-4 h-4" />
                </button>
                <button className="px-8 py-4 bg-transparent text-white text-base font-bold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-colors">
                    Schedule a Demo
                </button>
            </div>

            {/* Feature List */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 brightness-0 invert" />
                    <p className="text-sm font-medium">No credit card required</p>
                </div>
                <div className="flex items-center gap-2">
                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 brightness-0 invert" />
                    <p className="text-sm font-medium">14-day free trial</p>
                </div>
                <div className="flex items-center gap-2">
                    <img src={assets.tick_icon} alt="tick icon" className="w-5 h-5 brightness-0 invert" />
                    <p className="text-sm font-medium">Cancel anytime</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default LowerSection