import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

// HOC to inject logout from useAuth into class component
function withAuthActions(Component) {
  return function Wrapped(props) {
    const { logout } = useAuth();
    return <Component {...props} logout={logout} />;
  };
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        emailNotifications: true,
        autoRejectDays: 3,
        maxClassCapacity: 50,
        defaultPackagePrices: {
          threeMonth: 100,
          oneYear: 350
        },
        systemMaintenance: false
      },
      alert: null
    };
  }

  setAlert = (alert) => {
    this.setState({ alert });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { settings } = this.state;
    console.log('Settings saved:', settings);
    this.setAlert({ message: 'Settings saved successfully!', type: 'success' });
  };

  handleExportData = async () => {
    const { logout } = this.props;
    if (window.confirm('Are you sure you want to export your data?')) {
      try {
        const response = await axios.get('/api/auth/export-data');
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `account-data-${new Date()
          .toISOString()
          .split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.setAlert({
          message: 'Data exported successfully!',
          type: 'success'
        });
      } catch (error) {
        this.setAlert({ message: 'Failed to export data', type: 'error' });
      }
    }
  };

  handleDeactivateAccount = async () => {
    const { logout } = this.props;
    if (
      window.confirm(
        'Are you sure you want to deactivate your account? This action can be reversed by contacting support.'
      )
    ) {
      try {
        await axios.put('/api/auth/deactivate');
        this.setAlert({
          message:
            'Account deactivated successfully. You will be logged out.',
          type: 'success'
        });
        setTimeout(() => logout(), 2000);
      } catch (error) {
        this.setAlert({
          message: 'Failed to deactivate account',
          type: 'error'
        });
      }
    }
  };

  handleDeleteAccount = async () => {
    const { logout } = this.props;
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone!'
      )
    ) {
      if (
        window.confirm(
          'This will permanently delete all your data. Are you absolutely sure?'
        )
      ) {
        try {
          await axios.delete('/api/auth/delete-account');
          this.setAlert({
            message: 'Account deleted successfully.',
            type: 'success'
          });
          setTimeout(() => logout(), 2000);
        } catch (error) {
          this.setAlert({
            message: 'Failed to delete account',
            type: 'error'
          });
        }
      }
    }
  };

  render() {
    const { settings, alert } = this.state;

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
            marginBottom: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(40px)'
            }}
          ></div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <i className="fas fa-cogs"></i>
                System Settings
              </h1>
              <p
                style={{
                  marginTop: '0.75rem',
                  fontSize: '1.05rem',
                  opacity: 0.95,
                  maxWidth: '520px'
                }}
              >
                Configure notifications, class defaults, maintenance mode, and
                account-level actions for your admin panel.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '1.5rem 1.8rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                minWidth: '200px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              <i
                className="fas fa-tools"
                style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}
              ></i>
              <div
                style={{
                  fontSize: '1rem',
                  marginBottom: '0.3rem',
                  opacity: 0.9
                }}
              >
                Maintenance
              </div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: settings.systemMaintenance ? '#ffc107' : '#28a745'
                }}
              >
                {settings.systemMaintenance ? 'Enabled' : 'Normal'}
              </div>
            </div>
          </div>
        </div>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => this.setAlert(null)}
          />
        )}

        {/* Settings form */}
        <form
          onSubmit={this.handleSubmit}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            marginTop: '1rem',
            border: '1px solid rgba(170,141,111,0.2)'
          }}
        >
          {/* Notification settings */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                color: '#675541',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-bell"></i>
              Notification Settings
            </h3>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
                color: '#555',
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(170,141,111,0.2)'
              }}
            >
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  this.setState({
                    settings: {
                      ...settings,
                      emailNotifications: e.target.checked
                    }
                  })
                }
              />
              Enable email notifications for class requests
            </label>
          </div>

          {/* Class management */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                color: '#675541',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              Class Management
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}
              >
                Auto-reject requests after (days):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.autoRejectDays}
                onChange={(e) =>
                  this.setState({
                    settings: {
                      ...settings,
                      autoRejectDays: parseInt(e.target.value, 10)
                    }
                  })
                }
                style={{
                  width: '100px',
                  padding: '0.6rem',
                  border: '2px solid rgba(170,141,111,0.3)',
                  borderRadius: '10px',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}
              >
                Maximum class capacity:
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxClassCapacity}
                onChange={(e) =>
                  this.setState({
                    settings: {
                      ...settings,
                      maxClassCapacity: parseInt(e.target.value, 10)
                    }
                  })
                }
                style={{
                  width: '100px',
                  padding: '0.6rem',
                  border: '2px solid rgba(170,141,111,0.3)',
                  borderRadius: '10px',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Default package prices */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                color: '#675541',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-tags"></i>
              Default Package Prices
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  3 Month Package ($):
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.defaultPackagePrices.threeMonth}
                  onChange={(e) =>
                    this.setState({
                      settings: {
                        ...settings,
                        defaultPackagePrices: {
                          ...settings.defaultPackagePrices,
                          threeMonth: parseInt(e.target.value, 10)
                        }
                      }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  1 Year Package ($):
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.defaultPackagePrices.oneYear}
                  onChange={(e) =>
                    this.setState({
                      settings: {
                        ...settings,
                        defaultPackagePrices: {
                          ...settings.defaultPackagePrices,
                          oneYear: parseInt(e.target.value, 10)
                        }
                      }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* System maintenance */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                color: '#675541',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-exclamation-triangle"></i>
              System Maintenance
            </h3>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
                color: '#555',
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(170,141,111,0.2)'
              }}
            >
              <input
                type="checkbox"
                checked={settings.systemMaintenance}
                onChange={(e) =>
                  this.setState({
                    settings: {
                      ...settings,
                      systemMaintenance: e.target.checked
                    }
                  })
                }
              />
              Enable maintenance mode (prevents new registrations)
            </label>

            {settings.systemMaintenance && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '10px',
                  color: '#856404',
                  fontSize: '0.95rem'
                }}
              >
                ⚠️ Maintenance mode is enabled. Users cannot register for new
                classes.
              </div>
            )}
          </div>

          {/* System information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                color: '#675541',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-info-circle"></i>
              System Information
            </h3>

            <div
              style={{
                padding: '1rem 1.2rem',
                backgroundColor: '#f8f6f3',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#666',
                border: '1px solid rgba(170,141,111,0.25)'
              }}
            >
              <p>
                <strong>System Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Last Updated:</strong>{' '}
                {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Database Status:</strong> Connected
              </p>
              <p>
                <strong>Active Users:</strong> Loading...
              </p>
              <p>
                <strong>Total Classes:</strong> Loading...
              </p>
            </div>
          </div>

          <button
            type="submit"
            style={{
              background:
                'linear-gradient(135deg, #007bff 0%, #0062cc 100%)',
              color: 'white',
              border: 'none',
              padding: '0.8rem 2.2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,123,255,0.35)'
            }}
          >
            Save Settings
          </button>
        </form>

        {/* Account actions */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            marginTop: '2rem',
            border: '1px solid rgba(170,141,111,0.2)'
          }}
        >
          <h3
            style={{
              marginBottom: '1.5rem',
              color: '#675541',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-user-cog"></i>
            Account Actions
          </h3>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleExportData}
              style={{
                background:
                  'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.6rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(23,162,184,0.35)'
              }}
            >
              Export My Data
            </button>

            <button
              onClick={this.handleDeactivateAccount}
              style={{
                background:
                  'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                color: '#212529',
                border: 'none',
                padding: '0.75rem 1.6rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255,193,7,0.4)'
              }}
            >
              Deactivate Account
            </button>

            <button
              onClick={this.handleDeleteAccount}
              style={{
                background:
                  'linear-gradient(135deg, #dc3545 0%, #b51f32 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.6rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(220,53,69,0.45)'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthActions(Settings);
