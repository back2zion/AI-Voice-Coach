"use client"
// import { api } from '@/convex/_generated/api';
import { useUser } from '@/hooks/useAuth'
import { db } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { UserContext } from './_context/UserContext';

function AuthProvider({children}) {

    const user = useUser();
    // const CreateUser=useMutation(api.users.CreateUser);
    const [userData, setUserData]=useState();
    
    useEffect(() => {
        console.log(user)
        user&&CreateNewUser();
    },[user])

    const CreateNewUser=async()=>{
        try {
            // Try to create user in database (Supabase or localStorage)
            const newUser = await db.createUser({
                name: user?.displayName || 'Local User',
                email: user?.email || 'user@local.dev'
            });
            console.log('Created user:', newUser);
            setUserData(newUser);
        } catch (error) {
            // Fallback to local mock data
            console.log('Using local mock user data');
            setUserData({
                id: 'local-user-' + Date.now(),
                _id: 'local-user-' + Date.now(), // backward compatibility
                name: user?.displayName || 'Local User',
                email: user?.email || 'user@local.dev',
                tokens: 1000,
                credits: 100
            });
        }
    }

    return (
        <div>
            <UserContext.Provider value={{userData,setUserData}}>
                {children}
            </UserContext.Provider>
        </div>
    )
}

export default AuthProvider