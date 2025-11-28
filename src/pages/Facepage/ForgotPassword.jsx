import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import './Frontpage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  //const [mobile, setMobile] = useState(''); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const Navigate = useNavigate();

  //const predefinedEmail = "user123@gmail.com";  
 // const predefinedMobile = "09123456789";  

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/api/forgot_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const res = await response.json();
    console.log(res);
    if (res.success) {
      Navigate("/entercode");
    } else {
      setError(res.message);
    }
  } catch (err) {
    setError("Server error");
  }
};

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box" > 
         <h1>Find your Account</h1>
          <h5>Please enter your email or mobile number to search for your account.</h5>
       
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <input 
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="reset-password-button">Search</button>
        </form>

        <div className="Return-Home-Button">
            <Link to="/"><button>Back</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;