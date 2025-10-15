import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './Settings.css';
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../components/ProfileDropdown';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@health.gov',
    phone: '+63 912 345 6789',
    role: 'Administrator',
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
  });

  const handleSaveProfile = () => {
    // TODO: Implement API call
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    // TODO: Implement API call
    alert('Password change request submitted!');
  };

  return (
    <div className="FileMaintenance-Container">
      <Sidebar />
      <main className="FileMaintenance-Content">
         <div className="FileMaintenance-Header">
                  <div className="FileMaintenance-HeaderTitle">
                    <h1>Notifications</h1>
                  </div>
        
                  <div className="FileMaintenance-HeaderSetting">
                    <button className="emergency-button">
                      <BiError/>EMERGENCY MODE
                    </button>
                    <ProfileDropdown 
                      email="admin@klynx.com"
                      name="Admin User"
                    />
                  </div>
                </div>
        <hr />
        
        <div className="settings-page">
          <div className="settings-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile Information
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-lock"></i>
              Privacy & Security
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              <i className="fas fa-question-circle"></i>
              Help & Support
            </button>

            <button 
              className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <i className="fas fa-file-contract"></i>
              Terms & Conditions
            </button>
          </div>

          <div className="settings-body">
            {activeTab === 'profile' && (
              <div className="profile-section card">
                <div className="card-header">
                  <h3>Profile Information</h3>
                  <p className="card-description">Update your personal information and contact details</p>
                </div>
                <div className="card-content">
          
                  <div className="separator" />

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                          <i className="fas fa-envelope"></i>
                          <input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-with-icon">
                          <i className="fas fa-phone"></i>
                          <input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      </div>

                      <div className="form-group">
                        <label>Role</label>
                        <input value={profile.role} disabled />
                      </div>
                    

                    <div className="form-actions">
                      <button type="submit" className="save-button">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-section">
                <div className="card">
                  <div className="card-header">
                    <h3>Change Password</h3>
                    <p className="card-description">Update your password to keep your account secure</p>
                  </div>
                  <div className="card-content">
                    <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input id="currentPassword" type="password" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input id="newPassword" type="password" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input id="confirmPassword" type="password" />
                      </div>

                      <button type="submit" className="save-button">Change Password</button>
                    </form>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h3>Security Settings</h3>
                    <p className="card-description">Manage your account security preferences</p>
                  </div>
                  <div className="card-content">
                    <div className="security-option">
                      <div>
                        <label className="security-label">Two-Factor Authentication</label>
                        <p className="security-description">Add an extra layer of security to your account</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={security.twoFactorEnabled}
                          onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="separator" />

                    <div className="security-option">
                      <div>
                        <label className="security-label">Login Notifications</label>
                        <p className="security-description">Get notified when someone logs into your account</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={security.loginNotifications}
                          onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="separator" />

                    <div className="form-group">
                      <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                      <input
                        id="sessionTimeout"
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                      />
                      <p className="input-hint">Automatically log out after this many minutes of inactivity</p>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-button">Save Security Settings</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="help-section">
                <div className="card">
                  <div className="card-header">
                    <h3>Help & Support</h3>
                    <p className="card-description">Get assistance with the Healthcare Management System</p>
                  </div>
                  <div className="card-content">
                    <div className="help-cards">
                      <div className="help-card">
                        <h4>System Documentation</h4>
                        <p>Access comprehensive guides and tutorials for using the system</p>
                        <button className="outline-button">View Documentation</button>
                      </div>

                      <div className="help-card">
                        <h4>Video Tutorials</h4>
                        <p>Watch step-by-step video guides for common tasks</p>
                        <button className="outline-button">Watch Tutorials</button>
                      </div>

                      <div className="help-card">
                        <h4>Contact Support</h4>
                        <p>Need help? Our support team is here to assist you</p>
                        <div className="contact-info">
                          <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>support@healthcare.gov.ph</span>
                          </div>
                          <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <span>+63 2 1234 5678</span>
                          </div>
                        </div>
                        <button className="outline-button">Send Support Request</button>
                      </div>

                      <div className="help-card">
                        <h4>Frequently Asked Questions</h4>
                        <p>Find answers to common questions</p>
                        <button className="outline-button">View FAQs</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mt-4">
                  <div className="card-header">
                    <h3>System Information</h3>
                  </div>
                  <div className="card-content">
                    <div className="system-info">
                      <div className="info-row">
                        <span className="info-label">Version</span>
                        <span>1.0.0</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Last Updated</span>
                        <span>October 10, 2025</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">License</span>
                        <span>Government Use</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="terms-section">
                <div className="card">
                  <div className="card-header">
                    <h3>Terms & Conditions</h3>
                    <p className="card-description">Healthcare Management System - Terms of Use</p>
                  </div>
                  <div className="card-content">
                    <div className="terms-content">
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
                        <div className="contact-details">
                          <p>Healthcare Management System Administrator</p>
                          <p>Email: admin@healthcare.gov.ph</p>
                          <p>Phone: +63 2 1234 5678</p>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;