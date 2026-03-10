import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                toast.error(response.data.message);
            }
        }catch(error){
            toast.error(error.response?.data?.message || 'Failed to fetch user data');
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