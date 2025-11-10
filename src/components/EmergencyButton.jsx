import { useState } from 'react';
import { BiError } from 'react-icons/bi';
import Emergency from '../modules/admin/components/Emergency';

const EmergencyButton = () => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const handleOpenEmergency = () => {
    setIsEmergencyOpen(true);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpenEmergency}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          backgroundColor: '#fff',
          border: '2px solid #fc8181',
          borderRadius: '8px',
          color: '#c53030',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#fff5f5';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#fff';
        }}
      >
        <BiError size={20} />
        EMERGENCY MODE
      </button>

      <Emergency 
        isOpen={isEmergencyOpen} 
        onClose={handleCloseEmergency} 
      />
    </>
  );
};

export default EmergencyButton;