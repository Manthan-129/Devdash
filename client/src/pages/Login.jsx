import axios from 'axios'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'
import { AppContext } from '../context/AppContext.jsx'


const Login = () => {

    const {navigate, token , setToken, backendUrl }= useContext(AppContext);
    const {register, handleSubmit,resetField,  formState: {errors}}= useForm({ shouldUnregister: true });

    const [showEmail, setShowEmail]= useState(true);

    const [showPass, setShowPass]= useState(false);


    const onSubmit= async (data)=>{
        try{
            const response= await axios.post(backendUrl + '/api/auth/login', data);
            if(response.data.success){
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || 'Login failed');
        }
    }

    const handleToggle= ()=>{
        if(showEmail){
            resetField("email");
        }else{
            resetField("username");
        }
        setShowEmail(!showEmail);
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 px-4 py-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative z-10">

            {/* Welcome div */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200/50 mb-3 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Welcome Back
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Login to DevDash</h2>
                <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Email / Username toggle */}
                <div>
                    { showEmail ? (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                {...register("email", {required: 'Email is required' , pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                                placeholder="Enter your email"
                                className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                            <input 
                                type="text" 
                                {...register("username", {required: 'Username is required'})} 
                                placeholder="Enter your username"
                                className="w-full h-11 px-4 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                            />
                            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                        </div>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("password", {required: "Password is required", minLength:{value: 6, message: "Password must be at least 6 characters"}})} 
                            placeholder="Enter your password"
                            className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="" className="w-5 h-5" /> : <img src={assets.open_eye_icon} alt="" className="w-5 h-5" />}</button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                    <p
                        onClick={handleToggle}
                        className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline"
                    >
                        {showEmail ? "Use Username instead" : "Use Email instead"}
                    </p>
                    <p onClick={()=> navigate('/forgot-password')} className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline">
                        Forgot password?
                    </p>
                </div>

                {/* Submit */}
                <button 
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                    Login
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                    Don't have an account?
                    <span 
                        onClick={()=> navigate('/signup')}
                        className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 hover:underline ml-1"
                    >
                        Sign up here
                    </span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login