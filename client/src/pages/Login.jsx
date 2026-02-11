import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {useContext} from 'react'
import {AppContext} from '../context/AppContext.jsx'
import axios from 'axios'
import {toast} from 'react-toastify'


const Login = () => {

    const {navigate, token , setToken, backendUrl }= useContext(AppContext);
    const {register, handleSubmit,resetField,  formState: {errors}}= useForm({ shouldUnregister: true });

    const [showEmail, setShowEmail]= useState(true);

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


        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">


            {/* Welcome div*/}
            <div className="mb-8">

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>

                <p className="text-gray-600 text-sm">Please login to your account</p>

            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">


                {/* Email div */}
                
                <div>
                    { showEmail ? 
                (
                    <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                    </label>

                    <input 
                        type="email" 
                        {...register("email", {required: 'Email is required' , pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})} 
                        placeholder="Enter your email"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}

                </div>
                ) 
                : 
                (
                    <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Username
                    </label>

                    <input 
                        type="text" 
                        {...register("username", {required: 'Username is required'})} 
                        placeholder="Enter your username"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.username && (
                        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                    )}
                    </div>
                )
                }
                </div>

                {/* Password div */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                    </label>

                    <input 
                        type="password" 
                        {...register("password", {required: "Password is required", minLength:{value: 6, message: "Password must be at least 6 characters"}})} 
                        placeholder="Enter your password"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}

                </div>
                
                <div className="text-center">
                    <p
                        onClick={handleToggle}
                        className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 hover:underline"
                        >
                        {showEmail ? "Login using Username" : "Login using Email"}
                    </p>
                </div>

                {/* Submit Button div */}
                <div>

                    <button 
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    >
                        Login
                    </button>

                </div>


                {/* Paragraph Link */}
                <div className="text-center">

                    <p className="text-sm text-gray-600">
                        Don't have an account? 
                        <span 
                            onClick={()=> navigate('/signup')}
                            className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline ml-1"
                        >
                            Sign up here
                        </span>
                    </p>

                </div>


            </form>


        </div>


    </div>

  )
}

export default Login