import React from 'react'
import {useContext, useState} from 'react'
import {X} from 'lucide-react'
import {AppContext} from '../context/AppContext.jsx'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {toast} from 'react-toastify'
import OTP from '../components/OTP.jsx'
import {assets} from '../assets/assets.js'

const Signup = () => {

    const {navigate, setToken, backendUrl, token} = useContext(AppContext);
    const {register, handleSubmit, formState: {errors}, watch}= useForm();
    const [openOTP, setOpenOTP]= useState(false);
    const [otp, setOtp]= useState('');
    const [formData, setFormData]= useState(null);
    const [showPass, setShowPass]= useState(false);
    const password = watch("password");

    const onSubmit= async (data)=>{
        
        console.log(data);
        setFormData(data);
        try{
            const responseOTP= await axios.post(backendUrl + '/api/auth/send-registration-otp', {email: data.email, username: data.username});
            if(responseOTP.data.success){
                setOpenOTP(true);
            }else{
                toast.error(responseOTP.data.message);
            }
        }catch(error){
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    }
    
    const verifyOTP= async (e)=>{
        try{
            e.preventDefault();
            const response= await axios.post(backendUrl + '/api/auth/verify-registration-otp', {...formData, otp});
            if(response.data.success){
                setOpenOTP(false);
                setOtp('');
                console.log("Login successful");
                console.log("Received token:", response.data.token);
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }else{
                toast.error(response.data.message);
                console.log("Login failed:", response.data.message);
            }
        }catch(error){
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
        }
    }

    // Handle OTP change from OTP component
    const handleOTPChange= (otpValue)=>{
        setOtp(otpValue);
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">


        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">


            <div className="mb-5">

                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h2>

                <p className="text-gray-500 text-sm">Signup to get started</p>

            </div>


            {/* Error Message */}
            {errors.Message && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">

                    <p className="text-sm text-red-500">
                        {errors.Message.message}
                    </p>

                </div>

            )}


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


                {/* Name div */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                    {/* First Name div */}
                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            First Name
                        </label>

                        <input 
                            type="text" 
                            {...register("firstName" ,{required: "First name is required"})} 
                            placeholder="Enter your first name"
                            className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />

                        {errors.firstName && (
                            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>

                        )}

                    </div>


                    {/* Last Name div */}
                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Last Name
                        </label>

                        <input 
                            type="text" 
                            {...register("lastName" ,{required: "Last name is required"})} 
                            placeholder="Enter your last name"
                            className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />

                        {errors.lastName && (
                            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>

                        )}

                    </div>


                </div>
                

                {/* Username div */}
                <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Username
                    </label>

                    <input 
                        type="text" 
                        {...register("username" ,{required: "Username is required"})} 
                        placeholder="Enter your username"
                        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />

                    {errors.username && (
                        <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>

                    )}

                </div>

                {/* Email div */}
                <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Email Address
                    </label>

                    <input 
                        type="email" 
                        {...register("email" ,{required: "Email is required", pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                        placeholder="Enter your email address"
                        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />

                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>

                    )}

                </div>


                {/* Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Password
                    </label>

                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("password" ,{required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters"}})} 
                            placeholder="Enter your password"
                            className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5"  /> : <img src={assets.open_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5" />}</button>
                    </div>

                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>

                    )}

                </div>


                {/* Confirm Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("confirmPassword" ,{required: "Please confirm your password", validate: value=> value=== password || 'Password do not match'})} 
                            placeholder="Confirm your password"
                            className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5"  /> : <img src={assets.open_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5" />}</button>
                    </div>

                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>

                    )}
                </div>


                {/* Submit button div */}
                <div>

                    <button 
                        type="submit"
                        className="w-full h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
                    >
                        Sign Up
                    </button>

                </div>
                </form>
                


                {/* Paragraph Link */}
                <div className="text-center mt-5">

                    <p className="text-sm text-gray-500">
                        Already have an account? 
                        <span 
                            onClick={()=> navigate('/login')}
                            className="text-blue-500 font-medium cursor-pointer hover:text-blue-700 hover:underline ml-1"
                        >
                            Login here
                        </span>
                    </p>

                </div>


        </div>
        
        {openOTP && 
                <div 
                    onClick={()=> setOpenOTP(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                >
                    <div 
                        onClick={(e)=> e.stopPropagation()}
                        className="bg-white border border-gray-200 rounded-2xl shadow-xl p-7 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-gray-900">Enter OTP</h2>
                            <button 
                                onClick={()=>setOpenOTP(false)}
                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>
                        
                        <form onSubmit={verifyOTP} className="space-y-4">
                            <OTP value={otp} onChange={handleOTPChange} />
                            <button 
                                type="submit"
                                className="w-full h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
                            >
                                Verify OTP
                            </button>
                        </form>
                    </div>
                </div>
            }

    </div>

  )
}

export default Signup