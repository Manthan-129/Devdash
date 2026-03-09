import React, { useState, useContext, useEffect } from 'react'
import {AppContext} from '../context/AppContext.jsx'
import { X } from 'lucide-react'
import axios from 'axios'
import {toast} from 'react-toastify'
import OTP from '../components/OTP.jsx'

const ForgotPassword = () => {

    const {navigate, backendUrl}= useContext(AppContext);
    const [email, setEmail]= useState('');
    const [newPass, setNewPass]= useState('');
    const [otp, setOtp]= useState('');
    const [confirmNewPass, setConfirmNewPass]= useState('');
    const [isOtpModelOpen, setIsOtpModelOpen]= useState(false);

    
    const handleSendOtp= async (e)=>{
        e.preventDefault();
        try{
            const response= await axios.post(backendUrl + '/api/auth/forget-password-otp-request', {email});
            if(response.data.success){
                toast.success("OTP sent successfully!");
                setIsOtpModelOpen(true);
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    }

    const handleResetPassword= async(e)=>{
        e.preventDefault();
        if(otp.length !== 6){
            toast.error('Please enter a complete 6- digit OTP');
            return;
        }
        if( newPass !== confirmNewPass){
            toast.error('Confirm password does not match.');
            return;
        }
        try{
            const response= await axios.post(backendUrl + '/api/auth/verify-change-pass-otp', {email, otp, newPass});

            if(response.data.success){
                toast.success("Password reset Successfully. Now login again!");
                setEmail('');
                setIsOtpModelOpen(false);
                setNewPass('');
                setConfirmNewPass('');
                setOtp('');
                navigate('/login');
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response.data.message);
        }
    }

    // Handle OTP change from OTP component
    const handleOtpChange= (otpValue)=>{
        setOtp(otpValue);
    }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reset Password</h1>
            <div>
                <form onSubmit={handleSendOtp}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input type="text" placeholder="Enter your Email address" value={email} onChange={(e)=> setEmail(e.target.value)} required className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>

                    <button type='submit' className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all cursor-pointer">Send OTP</button>
                </form>
            </div>
        </div>

        <div className="mt-4 text-center absolute bottom-10">
            <span onClick={()=> navigate('/login')} className="text-sm text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">Back To Login</span>
        </div>

        {/* OTP Model */}
        {isOtpModelOpen && (
            <div onClick={()=> setIsOtpModelOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <div onClick={(e)=> e.stopPropagation()} className="bg-white border border-gray-200 rounded-2xl shadow-xl p-7 w-full max-w-md">
                    <div className="flex justify-end mb-2">
                        <X onClick={()=> setIsOtpModelOpen(false)} className="w-5 h-5 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">Enter OTP and New Password</h2>
                    <form onSubmit={handleResetPassword}> 
                        {/* OTP Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">OTP</label>
                            <OTP value={otp} onChange={handleOtpChange}></OTP>
                        </div>
                        {/* New Password Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">New password</label>
                            <input type="password" value={newPass} onChange={(e)=> setNewPass(e.target.value)} placeholder= "Enter new password" required minLength='6' className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                        </div>

                        {/* Confirm New Password Input */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm new password</label>
                            <input type="password" value={confirmNewPass} onChange={(e)=> setConfirmNewPass(e.target.value)} placeholder= "Confirm new password" required minLength='6' className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                        </div>
            
                        <button type='submit' disabled={otp.length !== 6} className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Reset Password</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default ForgotPassword