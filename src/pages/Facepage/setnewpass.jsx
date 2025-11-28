import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Frontpage.css";

const Setnewpass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch("http://localhost/api/reset_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        new_password: password,
      }),
    });

    const res = await response.json();

    if (res.success) {
      alert("Password updated successfully!");
      navigate("/login");
    } else {
      alert("Failed to update password. Try again.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page-box">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <h1>Set New Password</h1>
          <h5>
            Enter your new password.
            Recommended length is 6 characters long.
          </h5>

          <div className="new-password-form">
            <label htmlFor="newpass">New Password:</label>
            <input
              type="password"
              id="newpass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirmpass">Confirm New Password:</label>
            <input
              type="password"
              id="confirmpass"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="reset-password-button">
            Set New Password
          </button>
        </form>

        <div>
          <h5>Make sure your password is strong and unique.</h5>
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

export default Setnewpass;
