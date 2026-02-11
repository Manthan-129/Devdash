import React from 'react'
import {useContext, useState} from 'react'
import {X} from 'lucide-react'
import {AppContext} from '../context/AppContext.jsx'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {toast} from 'react-toastify'
import OTP from '../components/OTP.jsx'

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
            const response= await axios.post(backendUrl + '/api/auth/verify-registration-otp', {data: formData, otp});
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


        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">


            <div className="mb-5">

                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h2>

                <p className="text-gray-600 text-sm">Signup to get started</p>

            </div>


            {/* Error Message */}
            {errors.Message && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">

                    <p className="text-sm text-red-600">
                        {errors.Message.message}
                    </p>

                </div>

            )}


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


                {/* Name div */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                    {/* First Name div */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>

                        <input 
                            type="text" 
                            {...register("firstName" ,{required: "First name is required"})} 
                            placeholder="Enter your first name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {errors.firstName && (
                            <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>

                        )}

                    </div>


                    {/* Last Name div */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>

                        <input 
                            type="text" 
                            {...register("lastName" ,{required: "Last name is required"})} 
                            placeholder="Enter your last name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {errors.lastName && (
                            <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>

                        )}

                    </div>


                </div>
                

                {/* Username div */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>

                    <input 
                        type="text" 
                        {...register("username" ,{required: "Username is required"})} 
                        placeholder="Enter your username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.username && (
                        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>

                    )}

                </div>

                {/* Email div */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>

                    <input 
                        type="email" 
                        {...register("email" ,{required: "Email is required", pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>

                    )}

                </div>


                {/* Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>

                    <input 
                        type="password" 
                        {...register("password" ,{required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters"}})} 
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>

                    )}

                </div>


                {/* Confirm Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>

                    <input 
                        type="password" 
                        {...register("confirmPassword" ,{required: "Please confirm your password", validate: value=> value=== password || 'Password do not match'})} 
                        placeholder="Confirm your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>

                    )}

                </div>


                {/* Submit button div */}
                <div>

                    <button 
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    >
                        Sign Up
                    </button>

                </div>
                </form>
                


                {/* Paragraph Link */}
                <div className="text-center">

                    <p className="text-sm text-gray-600">
                        Already have an account? 
                        <span 
                            onClick={()=> navigate('/login')}
                            className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline ml-1"
                        >
                            Login here
                        </span>
                    </p>

                </div>


        </div>
        
        {openOTP && 
        <div onClick= {()=> setOpenOTP(false)}>
            <div onClick={(e)=> e.stopPropagation()}>
                <button onClick={()=>setOpenOTP(false)}><X /></button>

                <div>
                    <h2>Enter OTP</h2>
                </div>
                <form onSubmit={(e)=>verifyOTP(e)}>
                    <OTP value={otp} onChange={handleOTPChange} />
                    <button type="submit">Verify OTP</button>
                </form>
            </div>
        </div>
        }

    </div>

  )
}

export default Signup