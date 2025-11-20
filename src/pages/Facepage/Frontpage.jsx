import { useNavigate } from "react-router-dom";
import medikablue from "../../assets/picture/medikablue.svg";
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
        <img
          src={medikablue}
          alt="Logo"
          className="home-logo"
        />
      </div>

      {/* Buttons */}
      <div className="home-button-container">
        <button className="home-admin-button" onClick={() => navigate("/login")}>
          Admin
        </button>
        {/* <button className="home-patient-button" onClick={() => navigate("/logintwo")}>
          Patient
        </button> */}
      </div>
    </div>
  );
};

export default Home;
