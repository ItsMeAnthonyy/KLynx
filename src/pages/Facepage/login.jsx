import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Frontpage.css';
import axios from "axios";
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/DashboardAlt";

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const handleChange = (event) =>{
    const name = event.target.name;
    const value = event.target.value
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) =>{
        event.preventDefault();
        console.log(inputs);
        axios.post('http://localhost/api/login.php', inputs, {
          withCredentials: true, // ✅ Needed to accept PHP session cookie

        }).then(function(response){
          console.log(response.data);
          
          if (response.data && response.data.roles){
            setAuth({
              roles: [response.data.roles]
            });
            navigate(from, { replace: true });
          } else {
            console.error("Login failed: ", response.data.error);
          }
        });
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
  <div className="login-page">
    <div className="Login-Page-Box">
      
      <form className="login-form" onSubmit={handleSubmit}>
      <h1>Welcome!</h1>
        <div>
          <label htmlFor="adID">Username:</label>
          <input
            type="text"
            id="adID"
            name="adminID"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pwd">Password:</label>
          <input
            type="password"
            id="pwd"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button className="login-button-admin">Login</button>
      </form>
      <div>
        <Link to="/forgot-password" className="addlinks-admin">Forgot Password?</Link>
      </div>
    </div>
    <div className="Return-Home-Button">
    <Link to="/">
      <button>Back</button>
    </Link>
    </div>
  </div>
  );
};

export default Login;