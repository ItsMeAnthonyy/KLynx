import { useState } from 'react';
import { BiError } from 'react-icons/bi';
import styles from './EmergencyButton.module.css';
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
        className={styles.emergencyButton}
        onClick={handleOpenEmergency}
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