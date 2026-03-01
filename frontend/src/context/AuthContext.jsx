import {createContext, useContext, useState, useEffect} from 'react';
import { getProfileAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //Check if user is present when app loads.
        const token = localStorage.getItem("token");
        if(token){
            getProfileAPI()
            .then((res) => setUser(res.data))
            .catch(()=>{
                //There was a problem getting the profile data so token must be invalid or expired so we remove it.
                localStorage.removeItem("token")
            })
            .finally(() => {
                setLoading(false);
            })
        }else{
            setLoading(false);
        }

    }, []);

    function login(token, userData){
        localStorage.setItem("token",token);
        setUser(userData);
    }

    function logout(){
        localStorage.removeItem("token");
        setUser(null)
    }

    function updateUser(updatedData){
        setUser((prev) => ({...prev, ...updatedData}));
    }

    return(
        <AuthContext.Provider value = {{user, loading,login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}