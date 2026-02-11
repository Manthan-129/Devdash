import React, {useEffect, useState} from 'react'   
import {createContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContext= createContext();
    
export const AppContextProvider= (props)=>{
    const navigate= useNavigate();
    // const[token, setToken]= useState(localStorage.getItem('token') || null);
    const [token, setToken]= useState(localStorage.getItem('token') || null);
    const [user, setUser]= useState(null);

    const backendUrl =import.meta.env.VITE_BACKEND_URL;

    const fetchUserData= async ()=>{
        try{
            const response= await axios.get(backendUrl + '/api/auth/user-info', {headers: {Authorization: `Bearer ${token}`}});
            if(response.data.success){
                setUser(response.data.user);
            }else{
                console.log("Failed to fetch user data");
                toast.error(response.data.message);
            }
        }catch(error){
            console.log("Error fetching user data:", error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(token){
            fetchUserData();
        }else{
            setUser(null);
        }
    },[token]);

    const logoutUser= ()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    }
    
    const handleDeleteAccount = ()=>{
        logoutUser();
    }
    const value= {
        navigate,
        token, setToken,
        logoutUser, handleDeleteAccount,
        user, setUser,
        backendUrl, fetchUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}