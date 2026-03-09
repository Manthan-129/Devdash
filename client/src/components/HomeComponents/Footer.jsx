import React from 'react'
import {assets} from '../../assets/assets.js'

const Footer = () => {
  return (
    <div className="w-full bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
            
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                
                {/* Brand Section */}
                <div className="lg:col-span-2">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <img src={assets.code_icon} alt="code icon" className="w-6 h-6 brightness-0 invert" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Dev<span className="text-blue-400">Dash</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-md">
                            The all-in-one platform combining powerful project management with GitHub-like version control for modern development teams.
                        </p>
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <img src={assets.github_icon} alt="github icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <img src={assets.twitter_icon} alt="twitter icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <img src={assets.linkedin_icon} alt="linkedin icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <img src={assets.gmail_icon} alt="gmail icon" className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Products</h3>
                    <div className="space-y-2">
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Features</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Pricing</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Security</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Integration</p>
                    </div>
                </div>

                {/* Company Section */}
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">Company</h3>
                    <div className="space-y-2">
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">About Us</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Careers</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Contact</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors">Blog</p>
                    </div>
                </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-800 my-8"></div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-gray-500 text-sm">© 2026 DevDash. All rights reserved.</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <p className="text-gray-500 text-sm hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</p>
                    <p className="text-gray-500 text-sm hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</p>
                    <p className="text-gray-500 text-sm hover:text-blue-400 cursor-pointer transition-colors">Cookie Policy</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Footer