import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiCog, BiLogOut } from 'react-icons/bi';
import PropTypes from 'prop-types';


import './ProfileDropdown.css';

export default function ProfileDropdown({ email = "user@example.com", name = "User Name" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

 const handleSettings = () => {
    navigate('/Settings');
  }



  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BiUser className="profile-icon" />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <span className="user-name">{name}</span>
            <span className="user-email">{email}</span>
          </div>
          <hr />
          <button className="dropdown-item" onClick={handleSettings}>
            <BiCog className="dropdown-icon" />
            Settings
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            <BiLogOut className="dropdown-icon" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

ProfileDropdown.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
};
    
