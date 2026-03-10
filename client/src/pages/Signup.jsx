import axios from 'axios'
import { X } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'
import OTP from '../components/OTP.jsx'
import { AppContext } from '../context/AppContext.jsx'

const Signup = () => {

    const {navigate, setToken, backendUrl, token} = useContext(AppContext);
    const {register, handleSubmit, formState: {errors}, watch}= useForm();
    const [openOTP, setOpenOTP]= useState(false);
    const [otp, setOtp]= useState('');
    const [formData, setFormData]= useState(null);
    const [showPass, setShowPass]= useState(false);
    const password = watch("password");

    const onSubmit= async (data)=>{
        setFormData(data);
        try{
            const responseOTP= await axios.post(backendUrl + '/api/auth/send-registration-otp', {email: data.email, username: data.username});
            if(responseOTP.data.success){
                setOpenOTP(true);
            }else{
                toast.error(responseOTP.data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
    }
    
    const verifyOTP= async (e)=>{
        try{
            e.preventDefault();
            const response= await axios.post(backendUrl + '/api/auth/verify-registration-otp', {...formData, otp});
            if(response.data.success){
                setOpenOTP(false);
                setOtp('');
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    }

    // Handle OTP change from OTP component
    const handleOTPChange= (otpValue)=>{
        setOtp(otpValue);
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 px-4 py-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>

        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative z-10">

            <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/80 text-blue-700 text-xs font-bold rounded-full border border-blue-200/50 mb-3 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Join DevDash
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create Account</h2>
                <p className="text-gray-500 text-sm">Sign up to start managing your projects</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name div */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                        <input 
                            type="text" 
                            {...register("firstName" ,{required: "First name is required"})} 
                            placeholder="Enter your first name"
                            className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                        <input 
                            type="text" 
                            {...register("lastName" ,{required: "Last name is required"})} 
                            placeholder="Enter your last name"
                            className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                    </div>
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                    <input 
                        type="text" 
                        {...register("username" ,{required: "Username is required"})} 
                        placeholder="Choose a username"
                        className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />
                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input 
                        type="email" 
                        {...register("email" ,{required: "Email is required", pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                        placeholder="Enter your email address"
                        className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("password" ,{required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters"}})} 
                            placeholder="Create a password"
                            className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="" className="w-5 h-5" /> : <img src={assets.open_eye_icon} alt="" className="w-5 h-5" />}</button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("confirmPassword" ,{required: "Please confirm your password", validate: value=> value=== password || 'Passwords do not match'})} 
                            placeholder="Confirm your password"
                            className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="" className="w-5 h-5" /> : <img src={assets.open_eye_icon} alt="" className="w-5 h-5" />}</button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Submit */}
                <button 
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                    Sign Up
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                    Already have an account?
                    <span 
                        onClick={()=> navigate('/login')}
                        className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 hover:underline ml-1"
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
        
        {/* OTP Modal */}
        {openOTP && 
            <div 
                onClick={()=> setOpenOTP(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn"
            >
                <div 
                    onClick={(e)=> e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Verify Your Email</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Enter the 6-digit OTP sent to your email</p>
                        </div>
                        <button 
                            onClick={()=>setOpenOTP(false)}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            <X size={14} strokeWidth={2} />
                        </button>
                    </div>
                    
                    <form onSubmit={verifyOTP} className="space-y-4">
                        <OTP value={otp} onChange={handleOTPChange} />
                        <button 
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Verify & Create Account
                        </button>
                    </form>
                </div>
            </div>
        }

    </div>
  )
}

export default Signup