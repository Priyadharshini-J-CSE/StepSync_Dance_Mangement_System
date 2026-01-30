import React, { useState } from 'react';

const Alert = ({ message, type, onClose }) => (
  <div style={{
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    borderRadius: '12px',
    backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
    color: type === 'success' ? '#155724' : '#721c24',
    border: `2px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
      <i className={type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
      {message}
    </span>
    <button onClick={onClose} style={{ 
      background: 'none', 
      border: 'none', 
      fontSize: '1.5rem', 
      cursor: 'pointer',
      color: 'inherit',
      padding: '0 0.5rem'
    }}>×</button>
  </div>
);

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

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setAlert({ message: 'Settings saved successfully!', type: 'success' });
  };

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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ message: 'Password changed successfully!', type: 'success' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setAlert({ message: data.message || 'Failed to change password', type: 'error' });
      }
    } catch (error) {
      setAlert({ message: 'Failed to change password', type: 'error' });
    }
  };

  const handleExportData = () => {
    if (window.confirm('Are you sure you want to export your data?')) {
      const demoData = {
        user: { name: 'Demo User', email: 'demo@example.com' },
        exportDate: new Date().toISOString()
      };
      const dataStr = JSON.stringify(demoData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `account-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setAlert({ message: 'Data exported successfully!', type: 'success' });
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
      setAlert({ message: 'Account deactivation request submitted. Support will contact you.', type: 'success' });
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        setAlert({ message: 'Account deletion request submitted. Support will contact you.', type: 'success' });
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#675541',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-cog"></i>
          Settings
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', margin: 0 }}>
          Manage your account preferences and settings
        </p>
      </div>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Notification Settings */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginTop: 0,
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-bell"></i>
          Notification Preferences
        </h3>
        
        <div>
          <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { key: 'emailNotifications', icon: 'fas fa-envelope', label: 'Email notifications', desc: 'Receive notifications via email' },
              { key: 'smsNotifications', icon: 'fas fa-sms', label: 'SMS notifications', desc: 'Receive notifications via text message' },
              { key: 'classReminders', icon: 'fas fa-calendar-check', label: 'Class reminders', desc: 'Get reminded about upcoming classes' },
              { key: 'paymentReminders', icon: 'fas fa-credit-card', label: 'Payment reminders', desc: 'Get reminded about upcoming payments' },
              { key: 'marketingEmails', icon: 'fas fa-bullhorn', label: 'Marketing emails', desc: 'Receive promotional offers and updates' }
            ].map((item) => (
              <label key={item.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: 'rgba(170,141,111,0.08)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(170,141,111,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.15)';
                e.currentTarget.style.borderColor = '#aa8d6f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.08)';
                e.currentTarget.style.borderColor = 'rgba(170,141,111,0.2)';
              }}>
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    [item.key]: e.target.checked
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: '#aa8d6f'
                  }}
                />
                <i className={item.icon} style={{ fontSize: '1.3rem', color: '#aa8d6f', minWidth: '24px' }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#675541', marginBottom: '0.25rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>
                    {item.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleSettingsSubmit}
            style={{
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
            }}
          >
            <i className="fas fa-save"></i>
            Save Notification Settings
          </button>
        </div>
      </div>

      {/* App Preferences */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginTop: 0,
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-sliders-h"></i>
          App Preferences
        </h3>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          {[
            { key: 'language', icon: 'fas fa-globe', label: 'Language', options: [
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' }
            ]},
            { key: 'timezone', icon: 'fas fa-clock', label: 'Timezone', options: [
              { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
              { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
              { value: 'UTC-6', label: 'Central Time (UTC-6)' },
              { value: 'UTC-5', label: 'Eastern Time (UTC-5)' }
            ]},
            { key: 'theme', icon: 'fas fa-palette', label: 'Theme', options: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Auto (System)' }
            ]}
          ].map((item) => (
            <div key={item.key}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#675541',
                fontSize: '1.1rem'
              }}>
                <i className={item.icon} style={{ color: '#aa8d6f', fontSize: '1.2rem' }}></i>
                {item.label}:
              </label>
              <select
                value={settings[item.key]}
                onChange={(e) => setSettings({...settings, [item.key]: e.target.value})}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '0.875rem',
                  border: '2px solid rgba(170,141,111,0.3)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#675541',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#aa8d6f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {item.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginTop: 0,
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-lock"></i>
          Change Password
        </h3>
        
        <div>
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
            {[
              { key: 'currentPassword', icon: 'fas fa-key', label: 'Current Password' },
              { key: 'newPassword', icon: 'fas fa-lock', label: 'New Password' },
              { key: 'confirmPassword', icon: 'fas fa-lock', label: 'Confirm New Password' }
            ].map((field) => (
              <div key={field.key}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>
                  <i className={field.icon} style={{ color: '#aa8d6f' }}></i>
                  {field.label}:
                </label>
                <input
                  type="password"
                  value={passwordData[field.key]}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    [field.key]: e.target.value
                  })}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <button
              type="submit"
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
              transition: 'all 0.3s ease',
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(40,167,69,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.3)';
            }}
          >
            <i className="fas fa-check"></i>
            Change Password
          </button>
          </form>
        </div>
      </div>

      {/* Account Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginTop: 0,
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-user-shield"></i>
          Account Actions
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={handleExportData}
            style={{
              background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(23,162,184,0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(23,162,184,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(23,162,184,0.3)';
            }}
          >
            <i className="fas fa-download"></i>
            Export My Data
          </button>

          <button
            onClick={handleDeactivateAccount}
            style={{
              background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
              color: '#000',
              border: 'none',
              padding: '1rem 1.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(255,193,7,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255,193,7,0.3)';
            }}
          >
            <i className="fas fa-pause-circle"></i>
            Deactivate Account
          </button>

          <button
            onClick={handleDeleteAccount}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(220,53,69,0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(220,53,69,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.3)';
            }}
          >
            <i className="fas fa-trash-alt"></i>
            Delete Account
          </button>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
          borderRadius: '12px',
          fontSize: '0.95rem',
          color: '#856404',
          border: '2px solid #ffd89b',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <i className="fas fa-info-circle" style={{ fontSize: '1.3rem', marginTop: '0.1rem' }}></i>
            <div>
              <strong>Important Note:</strong> Account deactivation and deletion require manual approval from our support team. 
              Please contact <strong>support@zumbamanagement.com</strong> for assistance with these actions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;