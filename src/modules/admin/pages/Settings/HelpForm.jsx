import { useState, useEffect } from 'react';
import styles from './HelpForm.module.css';
import forms from './forms.module.css';

export default function HelpForm() {

    return(
        <div className={styles.helpSection}>
            <div className={forms.card}>
                <div className={forms.cardHeader}>
                    <h3>Help & Support</h3>
                    <p className={forms.cardDescription}>Get assistance with the Medical Record Management System</p>
                </div>
                <div className={forms.cardContent}>
                    <div className={styles.helpCards}>
                        <div className={styles.helpCard}>
                            <h4>System Documentation</h4>
                            <p>Access comprehensive guides and tutorials for using the system</p>
                            <button className={styles.outlineButton}>View Documentation</button>
                        </div>
                        <div className={styles.helpCard}>
                            <h4>Video Tutorials</h4>
                            <p>Watch step-by-step video guides for common tasks</p>
                            <button className={styles.outlineButton}>Watch Tutorials</button>
                        </div>
                        <div className={styles.helpCard}>
                            <h4>Contact Support</h4>
                            <p>Need help? Our support team is here to assist you</p>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <i className={`fas fa-envelope`}></i>
                                    <span>support@healthcare.gov.ph</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <i className={`fas fa-phone`}></i>
                                    <span>+63 2 1234 5678</span>
                                </div>
                            </div>
                            <button className={styles.outlineButton}>Send Support Request</button>
                        </div>
                        <div className={styles.helpCard}>
                            <h4>Frequently Asked Questions</h4>
                            <p>Find answers to common questions</p>
                            <button className={styles.outlineButton}>View FAQs</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${forms.card} ${forms.mt4}`}>
                <div className={forms.cardHeader}>
                    <h3>System Information</h3>
                </div>
                <div className={forms.cardContent}>
                    <div className={styles.systemInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Version</span>
                            <span>1.0.0</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Last Updated</span>
                            <span>April 1, 2026</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>License</span>
                            <span>Government Use</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}