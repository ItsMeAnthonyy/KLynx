import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './login.module.css';
import axios from "axios";
import useAuth from '../../../hooks/useAuth';
import { BiUser, BiUserCheck, BiMailSend, BiLock, BiErrorCircle, BiShow, BiHide } from "react-icons/bi";
import { loginUser } from '../api/loginApi';

const Login = () => {
    const [inputs, setInputs] = useState({}); // to be remove
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { setAuth } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/DashboardAlt";

    const navigate = useNavigate();

    // const handleChange = (event) =>{
    //     const name = event.target.name;
    //     const value = event.target.value
    //     setInputs(values => ({...values, [name]: value}));
    // }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            const loginRes = await loginUser(email, password);
            const { success, error, user_id, user_role, user_email, first_name, last_name} = loginRes.data;
            if (!success) {
                throw new Error(error || "Login failed");
            }

            setAuth({
                userId: user_id,
                userRole: user_role,
                userEmail: user_email,
                userFirstName: first_name,
                userLastName: last_name
            });
            navigate(from, { replace: true });

        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
        
        // axios.post('http://localhost/api/login.php', inputs, {
        //     withCredentials: true, // ✅ Needed to accept PHP session cookie

        // }).then(function(response){
        //     console.log(response.data);
        
        //     if (response.data && response.data.roles){
        //         setAuth({
        //         roles: [response.data.roles]
        //         });
        //         navigate(from, { replace: true });
        //     } else {
        //         console.error("Login failed: ", response.data.error);
        //     }
        // });
    };


/*
        // Check if username and password match predefined values
        if (username === predefinedUsername && password === predefinedPassword) 
        {
          console.log("Login successful");
          onLogin('admin');
          navigate("/dashboard");  // Navigate to the dashboard
        } 
        else
        {
          setError("Invalid username or password");
        }

  };*/

    return (

        <div className={styles.loginPage}>
            <div className={styles.loginPageBox}>
                <div className={styles.header}>
                    <h1 className={styles.title}>KLynx+ EMR Login</h1>
                    <p className={styles.subtitle}>
                        Sign in to access patient records
                    </p>
                </div>
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            <BiMailSend size={18} />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            <BiLock size={18} />
                            Password
                        </label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                autoComplete='current-password'
                            />
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <BiShow size={18} /> : <BiHide size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <BiErrorCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className={styles.success}>
                            <BiErrorCircle size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    
                </form>
                <div>
                    <Link to="/forgot-password" className={styles.addLinksAdmin}>Forgot Password?</Link>
                </div>
            </div>
        </div>

    );
};

export default Login;