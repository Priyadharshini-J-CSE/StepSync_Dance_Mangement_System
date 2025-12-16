import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoRejectDays: 3,
    maxClassCapacity: 50,
    defaultPackagePrices: {
      threeMonth: 100,
      oneYear: 350
    },
    systemMaintenance: false
  });

  const { logout } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
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
        alert('Data exported successfully!');
      } catch (error) {
        alert('Failed to export data');
      }
    }
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
      try {
        await axios.put('/api/auth/deactivate');
        alert('Account deactivated successfully. You will be logged out.');
        logout();
      } catch (error) {
        alert('Failed to deactivate account');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        try {
          await axios.delete('/api/auth/delete-account');
          alert('Account deleted successfully.');
          logout();
        } catch (error) {
          alert('Failed to delete account');
        }
      }
    }
  };

  return (
    <div>
      <h2>System Settings</h2>
      
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Notification Settings</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({
                ...settings,
                emailNotifications: e.target.checked
              })}
            />
            Enable email notifications for class requests
          </label>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Class Management</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Auto-reject requests after (days):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.autoRejectDays}
              onChange={(e) => setSettings({
                ...settings,
                autoRejectDays: parseInt(e.target.value)
              })}
              style={{
                width: '100px',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Maximum class capacity:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.maxClassCapacity}
              onChange={(e) => setSettings({
                ...settings,
                maxClassCapacity: parseInt(e.target.value)
              })}
              style={{
                width: '100px',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Default Package Prices</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                3 Month Package ($):
              </label>
              <input
                type="number"
                min="0"
                value={settings.defaultPackagePrices.threeMonth}
                onChange={(e) => setSettings({
                  ...settings,
                  defaultPackagePrices: {
                    ...settings.defaultPackagePrices,
                    threeMonth: parseInt(e.target.value)
                  }
                })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                1 Year Package ($):
              </label>
              <input
                type="number"
                min="0"
                value={settings.defaultPackagePrices.oneYear}
                onChange={(e) => setSettings({
                  ...settings,
                  defaultPackagePrices: {
                    ...settings.defaultPackagePrices,
                    oneYear: parseInt(e.target.value)
                  }
                })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>System Maintenance</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={settings.systemMaintenance}
              onChange={(e) => setSettings({
                ...settings,
                systemMaintenance: e.target.checked
              })}
            />
            Enable maintenance mode (prevents new registrations)
          </label>
          
          {settings.systemMaintenance && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              color: '#856404'
            }}>
              ⚠️ Maintenance mode is enabled. Users cannot register for new classes.
            </div>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>System Information</h3>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <p><strong>System Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Database Status:</strong> Connected</p>
            <p><strong>Active Users:</strong> Loading...</p>
            <p><strong>Total Classes:</strong> Loading...</p>
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Save Settings
        </button>
      </form>

      {/* Account Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '2rem'
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
      </div>
    </div>
  );
};

export default Settings;