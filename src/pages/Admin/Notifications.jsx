import { useState } from 'react';
import { BiPlus, BiTrash, BiSend, BiError } from 'react-icons/bi';
import Sidebar from "../../components/Sidebar";
import ProfileDropdown from '../../components/ProfileDropdown';
import styles from './Notifications.module.css';

const Notifications = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on October 15, 2025 at 10:00 PM',
      type: 'info',
      recipients: 'All Users',
      createdAt: new Date(2025, 9, 8),
      sentAt: new Date(2025, 9, 8),
    },
    {
      id: '2',
      title: 'New Health Advisory',
      message: 'Dengue cases increasing in Barangay 1. Please take precautionary measures.',
      type: 'warning',
      recipients: 'All Users',
      createdAt: new Date(2025, 9, 9),
      sentAt: new Date(2025, 9, 9),
    },
    {
      id: '3',
      title: 'Vaccination Drive',
      message: 'Free vaccination drive scheduled for October 20-22, 2025',
      type: 'success',
      recipients: 'Patients',
      createdAt: new Date(2025, 9, 10),
      sentAt: null,
    },
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all',
  });

  const handleCreateNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    const recipientsMap = {
      'all': 'All Users',
      'patients': 'Patients Only',
      'staff': 'Staff Only',
      'doctors': 'Doctors Only',
      'nurses': 'Nurses Only'
    };

    const notification = {
      id: String(Date.now()),
      ...newNotification,
      recipients: recipientsMap[newNotification.recipients] || 'All Users',
      createdAt: new Date(),
      sentAt: null,
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info', recipients: 'all' });
    setIsCreateDialogOpen(false);
    setMessage({ text: 'Notification created successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSendNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, sentAt: new Date() } : n
    ));
    setMessage({ text: 'Notification sent successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
      setMessage({ text: 'Notification deleted successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'success': return styles.badgeSuccess;
      case 'warning': return styles.badgeWarning;
      case 'error': return styles.badgeError;
      default: return styles.badgeInfo;
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Notifications Management</h1>
           
          </div>
          <div className={styles.headerRight}>
            <button className={styles.emergencyButton}>
              <BiError />
              EMERGENCY MODE
            </button>
            <ProfileDropdown 
              email="admin@klynx.com"
              name="Admin User"
            />
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </div>
        )}

        {/* Add Notification Button */}
        <div className={styles.actionSection}>
          <button className={styles.addButton} onClick={() => setIsCreateDialogOpen(true)}>
            <BiPlus size={20} />
            Create Notification
          </button>
        </div>

        {/* Notifications Table */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>All Notifications</h2>
          <p className={styles.tableSubtitle}>Manage and send notifications to users</p>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Message</th>
                <th>Type</th>
                <th>Recipients</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={notification.id}>
                  <td className={styles.indexCell}>{index + 1}</td>
                  <td className={styles.titleCell}>{notification.title}</td>
                  <td className={styles.messageCell}>{notification.message}</td>
                  <td>
                    <span className={`${styles.badge} ${getTypeBadgeClass(notification.type)}`}>
                      {notification.type}
                    </span>
                  </td>
                  <td>{notification.recipients}</td>
                  <td>{notification.createdAt.toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.badge} ${notification.sentAt ? styles.badgeSuccess : styles.badgeDraft}`}>
                      {notification.sentAt ? 'Sent' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      {!notification.sentAt && (
                        <button
                          className={styles.sendBtn}
                          onClick={() => handleSendNotification(notification.id)}
                          title="Send Notification"
                        >
                          <BiSend size={18} />
                        </button>
                      )}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Delete Notification"
                      >
                        <BiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyMessage}>
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Notification Modal */}
        {isCreateDialogOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Create New Notification</h2>
                <button className={styles.closeButton} onClick={() => setIsCreateDialogOpen(false)}>
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter notification title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Message <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Enter notification message"
                    rows={4}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type</label>
                    <select
                      className={styles.formSelect}
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Recipients</label>
                    <select
                      className={styles.formSelect}
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value })}
                    >
                      <option value="all">All Users</option>
                      <option value="patients">Patients Only</option>
                      <option value="staff">Staff Only</option>
                      <option value="doctors">Doctors Only</option>
                      <option value="nurses">Nurses Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </button>
                <button className={styles.saveBtn} onClick={handleCreateNotification}>
                  Create Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
