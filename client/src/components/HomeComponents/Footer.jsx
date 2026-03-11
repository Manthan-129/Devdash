import { assets } from '../../assets/assets.js'

const Footer = () => {
  return (
    <div className="w-full bg-gray-950 text-gray-300 py-14 px-4">
        <div className="max-w-7xl mx-auto">
            
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                
                {/* Brand Section */}
                <div className="lg:col-span-2">
                    <div className="mb-5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                                <img src={assets.code_icon} alt="code icon" className="w-5 h-5 brightness-0 invert" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">
                                Dev<span className="text-blue-400">Dash</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-md text-sm">
                            The all-in-one platform for project management, team collaboration, and pull request tracking — built for modern development teams.
                        </p>
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20">
                            <img src={assets.github_icon} alt="github icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20">
                            <img src={assets.twitter_icon} alt="twitter icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20">
                            <img src={assets.linkedin_icon} alt="linkedin icon" className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20">
                            <img src={assets.gmail_icon} alt="gmail icon" className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">Products</h3>
                    <div className="space-y-3">
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Features</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Pricing</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Security</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Integration</p>
                    </div>
                </div>

                {/* Company Section */}
                <div>
                    <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">Company</h3>
                    <div className="space-y-3">
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">About Us</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Careers</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Contact</p>
                        <p className="hover:text-blue-400 cursor-pointer transition-colors text-sm">Blog</p>
                    </div>
                </div>
            </div>

            {/* Separator Line */}
            <div className="border-t border-gray-800/80 my-8"></div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-gray-500 text-xs">&copy; 2026 DevDash. All rights reserved.</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <p className="text-gray-500 text-xs hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</p>
                    <p className="text-gray-500 text-xs hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</p>
                    <p className="text-gray-500 text-xs hover:text-blue-400 cursor-pointer transition-colors">Cookie Policy</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Footer