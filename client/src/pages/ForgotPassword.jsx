import axios from 'axios'
import { X } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import OTP from '../components/OTP.jsx'
import { AppContext } from '../context/AppContext.jsx'

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
                toast.success(response.data.message);
                setIsOtpModelOpen(true);
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || 'Failed to send OTP');
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
                toast.success(response.data.message);
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
            toast.error(error.response?.data?.message || 'Password reset failed');
        }
    }

    // Handle OTP change from OTP component
    const handleOtpChange= (otpValue)=>{
        setOtp(otpValue);
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl p-8 w-full max-w-md relative z-10">
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/80 text-amber-700 text-xs font-bold rounded-full border border-amber-200/50 mb-3 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Account Recovery
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset Password</h1>
                <p className="text-gray-500 text-sm">Enter your email to receive a reset OTP</p>
            </div>
            <div>
                <form onSubmit={handleSendOtp}>
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" placeholder="Enter your email address" value={email} onChange={(e)=> setEmail(e.target.value)} required className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                    </div>
                    <button type='submit' className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 text-white text-sm font-bold rounded-xl transition-all cursor-pointer">Send OTP</button>
                </form>
            </div>

            <div className="text-center mt-6">
                <span onClick={()=> navigate('/login')} className="text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline cursor-pointer transition-colors">Back to Login</span>
            </div>
        </div>

        {/* OTP Modal */}
        {isOtpModelOpen && (
            <div onClick={()=> setIsOtpModelOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
                <div onClick={(e)=> e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md border border-gray-100">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Reset Your Password</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Enter the OTP and your new password</p>
                        </div>
                        <button onClick={()=> setIsOtpModelOpen(false)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                            <X size={14} strokeWidth={2} />
                        </button>
                    </div>
                    <form onSubmit={handleResetPassword} className="space-y-4"> 
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">OTP Code</label>
                            <OTP value={otp} onChange={handleOtpChange}></OTP>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                            <input type="password" value={newPass} onChange={(e)=> setNewPass(e.target.value)} placeholder="Enter new password" required minLength='6' className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                            <input type="password" value={confirmNewPass} onChange={(e)=> setConfirmNewPass(e.target.value)} placeholder="Confirm new password" required minLength='6' className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                        </div>
                        <button type='submit' disabled={otp.length !== 6} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Reset Password</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default ForgotPassword