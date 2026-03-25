import axios from "axios";
import { createContext, useEffect, useState } from "react";
import styles from './AuthProvider.module.css';  

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get("http://localhost/api/get_session.php", { withCredentials: true })
            .then(res => {
                if (res.data?.logged_in) {
                    setAuth({
                        userId: res.data.user_id,
                        userRole: res.data.role,
                        userEmail: res.data.email,
                        userFirstName: res.data.first_name,
                        userLastName: res.data.last_name
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
    if (loading) {
        return ( 
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;