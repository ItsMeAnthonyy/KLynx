import { useState, useEffect } from 'react';
import styles from './TermsForm.module.css';
import forms from './forms.module.css';


export default function TermsForm() {

    return(
        <div className={styles.card}>
            <div className={forms.cardHeader}>
                <h3>Terms & Conditions</h3>
                <p className={forms.cardDescription}>Medical Record Management System - Terms of Use</p>
            </div>
            <div className={forms.cardContent}>
                <div className={styles.termsContent}>
                    <section>
                        <h4>1. Acceptance of Terms</h4>
                        <p>By accessing and using the Healthcare Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this system.</p>
                    </section>
                    <section>
                        <h4>2. Use of System</h4>
                        <p>This system is provided for authorized healthcare personnel only. Users must:</p>
                        <ul>
                            <li>Use the system only for legitimate healthcare purposes</li>
                            <li>Maintain the confidentiality of patient information</li>
                            <li>Not share login credentials with unauthorized persons</li>
                            <li>Report any security breaches immediately</li>
                            <li>Comply with all applicable healthcare regulations and laws</li>
                        </ul>
                    </section>
                    <section>
                        <h4>3. Data Privacy and Confidentiality</h4>
                        <p>All patient data is confidential and protected under the Data Privacy Act of 2012 (Republic Act No. 10173). Users must:</p>
                    </section>
                    <section>
                        <h4>4. System Availability</h4>
                        <p>While we strive to maintain continuous system availability, we do not guarantee uninterrupted access. Scheduled maintenance and emergency repairs may result in temporary system downtime. Users will be notified in advance when possible.</p>
                    </section>
                    <section>
                        <h4>5. Data Accuracy and Liability</h4>
                        <p>Users are responsible for ensuring the accuracy of all data entered into the system. The system administrators are not liable for clinical decisions made based on inaccurate or incomplete data. Always verify critical information before making healthcare decisions.</p>
                    </section>
                    <section>
                        <h4>6. Intellectual Property</h4>
                        <p>All system content, features, and functionality are owned by the healthcare facility and are protected by copyright, trademark, and other intellectual property laws. Unauthorized reproduction or distribution is prohibited.</p>
                    </section>
                    <section>
                        <h4>7. Prohibited Activities</h4>
                        <p>The following activities are strictly prohibited:</p>
                        <ul>
                            <li>Attempting to gain unauthorized access to any system components</li>
                            <li>Introducing malware, viruses, or harmful code</li>
                            <li>Attempting to reverse engineer or decompile the system</li>
                            <li>Using the system for personal gain or non-healthcare purposes</li>
                            <li>Tampering with or falsifying medical records</li>
                        </ul>
                    </section>
                    <section>
                        <h4>8. Audit and Monitoring</h4>
                        <p>All system activities are logged and may be audited for security, compliance, and quality assurance purposes. Users have no expectation of privacy when using this system. Suspicious activities will be investigated and may be reported to appropriate authorities.</p>
                    </section>
                    <section>
                        <h4>9. Account Termination</h4>
                        <p>User accounts may be suspended or terminated for violations of these terms, security breaches, or upon termination of employment. Access may also be revoked if inactive for extended periods as defined by facility policy.</p>
                    </section>
                    <section>
                        <h4>10. Changes to Terms</h4>
                        <p>These terms may be updated periodically. Users will be notified of significant changes and continued use of the system constitutes acceptance of modified terms. It is the user&apos;s responsibility to review these terms regularly.</p>
                    </section>
                    <section>
                        <h4>11. Contact Information</h4>
                        <p>For questions about these terms, please contact:</p>
                        <div className={styles.contactDetails}>
                            <p>Healthcare Management System Administrator</p>
                            <p>Email: admin@healthcare.gov.ph</p>
                            <p>Phone: +63 2 1234 5678</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}