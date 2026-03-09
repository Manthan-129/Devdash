import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {useContext} from 'react'
import {AppContext} from '../context/AppContext.jsx'
import axios from 'axios'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets.js'


const Login = () => {

    const {navigate, token , setToken, backendUrl }= useContext(AppContext);
    const {register, handleSubmit,resetField,  formState: {errors}}= useForm({ shouldUnregister: true });

    const [showEmail, setShowEmail]= useState(true);

    const [showPass, setShowPass]= useState(false);


    const onSubmit= async (data)=>{
        console.log(data);
        try{
            const response= await axios.post(backendUrl + '/api/auth/login', data);
            if(response.data.success){
                console.log("Login successful");
                console.log("Received token:", response.data.token);
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }else{
                console.log("Login failed:", response.data.message);
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">


        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">


            {/* Welcome div*/}
            <div className="mb-8">

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>

                <p className="text-gray-500 text-sm">Please login to your account</p>

            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">


                {/* Email div */}
                
                <div>
                    { showEmail ? 
                (
                    <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Email Address
                    </label>

                    <input 
                        type="email" 
                        {...register("email", {required: 'Email is required' , pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                        placeholder="Enter your email"
                        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />

                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}

                </div>
                ) 
                : 
                (
                    <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Username
                    </label>

                    <input 
                        type="text" 
                        {...register("username", {required: 'Username is required'})} 
                        placeholder="Enter your username"
                        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                    />

                    {errors.username && (
                        <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                    )}
                    </div>
                )
                }
                </div>

                {/* Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Password
                    </label>

                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"}
                            {...register("password", {required: "Password is required", minLength:{value: 6, message: "Password must be at least 6 characters"}})} 
                            placeholder="Enter your password"
                            className="w-full h-10 px-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        />
                        <button onClick={()=> setShowPass(!showPass)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{showPass ? <img src={assets.close_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5"  /> : <img src={assets.open_eye_icon} alt="Toggle Password Visibility" className="w-5 h-5" />}</button>
                    </div>

                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>
                
                <div className="text-center">
                    <p
                        onClick={handleToggle}
                        className="text-sm text-blue-500 cursor-pointer hover:text-blue-700 hover:underline"
                        >
                        {showEmail ? "Login using Username" : "Login using Email"}
                    </p>
                </div>
                
                <div className="text-center">
                    <p onClick={()=> navigate('/forgot-password')} className="text-sm text-blue-500 cursor-pointer hover:text-blue-700 hover:underline">
                        Forgot password? Click here
                    </p>
                </div>
                {/* Submit Button div */}
                <div>

                    <button 
                        type="submit"
                        className="w-full h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
                    >
                        Login
                    </button>

                </div>
            </form>

                    {/* Paragraph Link */}
                <div className="text-center mt-5">

                    <p className="text-sm text-gray-500">
                        Don't have an account? 
                        <span 
                            onClick={()=> navigate('/signup')}
                            className="text-blue-500 font-medium cursor-pointer hover:text-blue-700 hover:underline ml-1"
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