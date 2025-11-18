import axios from "axios";
import { createContext, useEffect, useState } from "react";
  

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get("http://localhost/api/get_session.php", { withCredentials: true })
            .then(res => {
                if (res.data?.logged_in) {
                    setAuth({
                        userRole: res.data.role
                    });
                }


                // if (res.data?.adminID) {
                    // setAuth({
                    //     adminID: res.data.adminID,
                    //     roles: [Number(res.data.roles)]
                    // });
                // }
            })
            .finally(() => setLoading(false));
    }, []);
    
    console.log("Login info:", auth);
    if (loading) return <div>Loading...</div>;


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;