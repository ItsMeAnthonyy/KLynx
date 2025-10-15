import { useState } from 'react';
import "../../components/css/FileMaintenance.css";
import { BiPlus, BiTrash, BiSend } from 'react-icons/bi';
import Sidebar from "../../components/Sidebar";
import { BiError } from 'react-icons/bi';
import Settings from '../Admin/Settings';
import ProfileDropdown from '../../components/ProfileDropdown';


const Notifications = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isSettingsOpen) {
    return <Settings onClose={() => setIsSettingsOpen(false)} />;
  }

  const handleCreateNotification = () => {
    const notification = {
      id: String(notifications.length + 1),
      ...newNotification,
      recipients: newNotification.recipients === 'all' ? 'All Users' : 'Patients',
      createdAt: new Date(),
      sentAt: null,
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info', recipients: 'all' });
    setIsCreateDialogOpen(false);
  };

  const handleSendNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, sentAt: new Date() } : n
    ));
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-info';
    }
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

        <div className="FileMaintenance-TableContainer">
          <div className="FileMaintenance-TableTitle">  
            <h2>All Notifications</h2>
            <div className="FileMaintenance-AddSearch">
            <button onClick={() => setIsCreateDialogOpen(true)} >
              <BiPlus  />
              Create Notification
            </button>
          </div>
        </div>
              
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Type</th>
                <th>Recipients</th>
                <th>Created</th>
                <th>Status</th>
                <th colSpan="1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.id}>
                  <td>{notification.title}</td>
                  <td className="truncate max-w-[200px]">{notification.message}</td>
                  <td>
                    <span className={`badge ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </td>
                  <td>{notification.recipients}</td>
                  <td>{notification.createdAt.toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${notification.sentAt ? 'bg-success' : 'bg-warning'}`}>
                      {notification.sentAt ? 'Sent' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {!notification.sentAt && (
                        <td>
                        <button
                          onClick={() => handleSendNotification(notification.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                          <BiSend className="FileMaintenance-TableIcon" />
                          Send
                        </button>
                        </td>
                      )}
                      <td>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <BiTrash className="FileMaintenance-TableIcon" />
                      </button>
                        </td>
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isCreateDialogOpen && (
          <div className="add-doctors-popup-overlay">
            <div className="add-doctors-popup-content">
              <div className="add-doctors-popup-header history-popup-header">
                <h2>Create New Notification</h2>
                <button className="close-button" onClick={() => setIsCreateDialogOpen(false)}>X</button>
              </div>

              <div className="add-doctors-form">
                <div className="add-doctors-column">
                  <div className="add-doctors-input-box">
                    <label className="required">Title</label>
                    <input
                      type="text"
                      placeholder="Enter notification title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="add-doctors-column">
                  <div className="add-doctors-input-box">
                    <label className="required">Message</label>
                    <textarea
                      placeholder="Enter notification message"
                      rows={4}
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    />
                  </div>
                </div>

                <div className="add-doctors-column">
                  <div className="add-doctors-input-box">
                    <label className="required">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                      className="site-select"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div className="add-doctors-input-box">
                    <label className="required">Recipients</label>
                    <select
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value })}
                      className="site-select"
                    >
                      <option value="all">All Users</option>
                      <option value="patients">Patients Only</option>
                      <option value="staff">Staff Only</option>
                      <option value="doctors">Doctors Only</option>
                      <option value="nurses">Nurses Only</option>
                    </select>
                  </div>
                </div>

                <div className="add-doctors-buttons">
                  <button className="add-doctors-save-button" onClick={handleCreateNotification}>
                    Create Notification
                  </button>
                  <button className="add-doctors-cancel-button" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
