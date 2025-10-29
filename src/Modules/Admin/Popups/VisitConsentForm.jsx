import { BiPrinter } from "react-icons/bi";
import styles from './VisitConsentForm.module.css';

const ConsentForm = ({ patient }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Patient Consent Form</h3>
        <button
          type="button"
          className={styles.printButton}
          onClick={handlePrint}
          aria-label="Print consent form"
        >
          <BiPrinter size={18} />
          Print
        </button>
      </div>

      <div className={styles.content} id="consent-form">
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Informed Consent for Medical Treatment</h4>
          
          <div className={styles.patientInfo}>
            <p>
              <strong>Patient Name:</strong> {patient?.fullName}
            </p>
            <p>
              <strong>Family ID:</strong> {patient?.familyId}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Purpose of Treatment</h4>
          <p className={styles.text}>
            I understand that I am being examined and/or treated for the medical condition(s) 
            described by my healthcare provider. The purpose of this consent is to ensure that 
            I understand the nature of my treatment and give my informed consent for any 
            procedures that may be necessary.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Authorization</h4>
          <p className={styles.text}>
            I hereby authorize the healthcare provider and their assistants to perform 
            diagnostic procedures and medical treatment as deemed necessary. I understand 
            that the practice of medicine is not an exact science and that no guarantees 
            have been made to me concerning the results of any examination or treatment.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Risks and Benefits</h4>
          <p className={styles.text}>
            I have been informed of the potential risks, benefits, and alternatives to the 
            proposed treatment. I have had the opportunity to ask questions and have received 
            satisfactory answers. I understand that I have the right to refuse treatment.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Privacy and Confidentiality</h4>
          <p className={styles.text}>
            I understand that my medical information will be kept confidential and will only 
            be shared with other healthcare providers involved in my care, or as required by 
            law. I consent to the use of my medical information for treatment, payment, and 
            healthcare operations.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Patient Rights</h4>
          <p className={styles.text}>
            I understand that I have the right to:
          </p>
          <ul className={styles.list}>
            <li>Receive information about my condition and treatment options</li>
            <li>Participate in decisions about my healthcare</li>
            <li>Refuse treatment or withdraw consent at any time</li>
            <li>Request a second opinion</li>
            <li>Access my medical records</li>
          </ul>
        </div>

        <div className={styles.acknowledgment}>
          <p className={styles.text}>
            <strong>
              By providing consent during this visit, I acknowledge that I have read and 
              understood this consent form, and I voluntarily agree to the treatment 
              described above.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
