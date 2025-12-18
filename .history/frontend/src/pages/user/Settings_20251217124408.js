import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    classReminders: true,
    paymentReminders: true,
    marketingEmails: false,
    language: 'en',
    timezone: 'UTC-5',
    theme: 'light'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [alert, setAlert] = useState(null);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/settings', settings);
      setAlert({ message: 'Settings saved successfully!', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to save settings', type: 'error' });
    }
  };

  const { logout } = useAuth();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ message: 'New passwords do not match!', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters long!', type: 'error' });
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setAlert({ message: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  const handleExportData = async () => {
    if (window.confirm('Are you sure you want to export your data?')) {
      try {
        const response = await axios.get('/api/auth/export-data');
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `account-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setAlert({ message: 'Data exported successfully!', type: 'success' });
      } catch (error) {
        setAlert({ message: 'Failed to export data', type: 'error' });
      }
    }
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
      try {
        await axios.put('/api/auth/deactivate');
        setAlert({ message: 'Account deactivated successfully. You will be logged out.', type: 'success' });
        setTimeout(() => logout(), 2000);
      } catch (error) {
        setAlert({ message: 'Failed to deactivate account', type: 'error' });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        try {
          await axios.delete('/api/auth/delete-account');
          setAlert({ message: 'Account deleted successfully.', type: 'success' });
          setTimeout(() => logout(), 2000);
        } catch (error) {
          setAlert({ message: 'Failed to delete account', type: 'error' });
        }
      }
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Notification Settings */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Notification Preferences</h3>
        
        <form onSubmit={handleSettingsSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  emailNotifications: e.target.checked
                })}
              />
              <span>Email notifications</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                (Receive notifications via email)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  smsNotifications: e.target.checked
                })}
              />
              <span>SMS notifications</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                (Receive notifications via text message)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.classReminders}
                onChange={(e) => setSettings({
                  ...settings,
                  classReminders: e.target.checked
                })}
              />
              <span>Class reminders</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                (Get reminded about upcoming classes)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.paymentReminders}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentReminders: e.target.checked
                })}
              />
              <span>Payment reminders</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                (Get reminded about upcoming payments)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => setSettings({
                  ...settings,
                  marketingEmails: e.target.checked
                })}
              />
              <span>Marketing emails</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                (Receive promotional offers and updates)
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Notification Settings
          </button>
        </form>
      </div>

      {/* App Preferences */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>App Preferences</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Language:
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px'
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Timezone:
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px'
              }}
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Theme:
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value})}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Change Password</h3>
        
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Current Password:
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                New Password:
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Confirm New Password:
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1.5rem'
            }}
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Account Actions</h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportData}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export My Data
          </button>

          <button
            onClick={handleDeactivateAccount}
            style={{
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Deactivate Account
          </button>

          <button
            onClick={handleDeleteAccount}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete Account
          </button>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <strong>Note:</strong> Account deactivation and deletion require manual approval from our support team. 
          Please contact support@zumbamanagement.com for assistance with these actions.
        </div>
      </div>
    </div>
  );
};

export default Settings;