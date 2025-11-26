import { useNavigate } from "react-router-dom";
import KLynx from "../../assets/picture/klynx.png";

import './Frontpage.css'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-navbar">
        <a href="/about" className="home-nav-link">ABOUT US</a>
        <a href="/contact" className="home-nav-link">CONTACT</a>
      </nav>

      {/* Logo */}
      <div className="home-logo-container">
        <h1>KLynx</h1>
        <img
          src={KLynx}
          alt="Logo"
          className="home-logo"
        />
      </div>

      {/* Buttons */}
      <div className="home-button-container">
        <button className="home-admin-button" onClick={() => navigate("/login")}>
          Login
        </button>
        {/* <button className="home-patient-button" onClick={() => navigate("/logintwo")}>
          Patient
        </button> */}
      </div>
    </div>
  );
};

export default Home;
