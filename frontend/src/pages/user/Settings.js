import React, { useState } from 'react';

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

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd save these settings to the backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    // In a real app, you'd make an API call to change the password
    console.log('Password change requested');
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <h2>Settings</h2>
      
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
            onClick={() => {
              if (window.confirm('Are you sure you want to export your data?')) {
                alert('Data export will be sent to your email within 24 hours.');
              }
            }}
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
            onClick={() => {
              if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
                alert('Account deactivation request submitted. Please contact support to complete the process.');
              }
            }}
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
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                  alert('Account deletion request submitted. Please contact support to complete the process.');
                }
              }
            }}
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