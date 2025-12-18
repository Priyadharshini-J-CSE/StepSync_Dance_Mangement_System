import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

// HOC to pass `user` into a class component
function withAuthUser(Component) {
  return function Wrapped(props) {
    const { user } = useAuth();
    return <Component {...props} user={user} />;
  };
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      isEditing: false,
      formData: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
      },
      alert: null
    };
  }

  componentDidUpdate(prevProps) {
    // Update form data when user prop changes
    if (this.props.user && this.props.user !== prevProps.user) {
      const { user } = this.props;
      this.setState({
        formData: {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        }
      });
    }
  }

  setAlert = (alert) => {
    this.setState({ alert });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = this.state;
    try {
      await axios.put('/api/auth/profile', formData);
      this.setState({
        isEditing: false,
        alert: { message: 'Profile updated successfully!', type: 'success' }
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.setState({
        alert: { message: 'Failed to update profile', type: 'error' }
      });
    }
  };

  render() {
    const { user } = this.props;
    const { isEditing, formData, alert } = this.state;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
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
              alignItems: 'center',
              justifyContent: 'space-between'
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
                <i className="fas fa-user-shield"></i>
                Admin Profile
              </h1>
              <p
                style={{
                  marginTop: '0.75rem',
                  fontSize: '1.05rem',
                  opacity: 0.95
                }}
              >
                Manage your administrator details and keep your contact
                information up to date.
              </p>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '1.2rem 1.6rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                minWidth: '160px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              <div
                style={{
                  fontSize: '2.2rem',
                  marginBottom: '0.35rem'
                }}
              >
                <i className="fas fa-user-circle"></i>
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  opacity: 0.9,
                  marginBottom: '0.2rem'
                }}
              >
                Role
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}
              >
                {user?.role || 'ADMIN'}
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

        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)'
          }}
        >
          {!isEditing ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: '#675541',
                    fontSize: '1.7rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-id-card"></i>
                  Profile Information
                </h3>
                <button
                  onClick={() => this.setState({ isEditing: true })}
                  style={{
                    background:
                      'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.7rem 1.6rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(170,141,111,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '1.2rem',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  padding: '1.8rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(170,141,111,0.2)'
                }}
              >
                {[
                  { label: 'Name', value: user?.name, icon: 'fas fa-user' },
                  { label: 'Email', value: user?.email, icon: 'fas fa-envelope' },
                  {
                    label: 'Phone',
                    value: user?.phone || 'Not provided',
                    icon: 'fas fa-phone'
                  },
                  {
                    label: 'Address',
                    value: user?.address || 'Not provided',
                    icon: 'fas fa-map-marker-alt'
                  }
                ].map((field, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.8rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: '10px'
                    }}
                  >
                    <i
                      className={field.icon}
                      style={{ color: '#aa8d6f', fontSize: '1.1rem' }}
                    ></i>
                    <div>
                      <label
                        style={{
                          fontWeight: '600',
                          color: '#675541',
                          fontSize: '0.9rem'
                        }}
                      >
                        {field.label}:
                      </label>
                      <p
                        style={{
                          margin: '0.25rem 0 0 0',
                          color: '#555',
                          fontSize: '0.98rem'
                        }}
                      >
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Role & Status */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '0.5rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      padding: '0.8rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: '10px'
                    }}
                  >
                    <i
                      className="fas fa-user-shield"
                      style={{ color: '#aa8d6f', fontSize: '1.1rem' }}
                    ></i>
                    <div>
                      <label
                        style={{
                          fontWeight: '600',
                          color: '#675541',
                          fontSize: '0.9rem'
                        }}
                      >
                        Role:
                      </label>
                      <p style={{ margin: '0.25rem 0 0 0' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
                        >
                          {user?.role?.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      padding: '0.8rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: '10px'
                    }}
                  >
                    <i
                      className="fas fa-circle"
                      style={{
                        color:
                          user?.status === 'active'
                            ? '#28a745'
                            : '#ffc107',
                        fontSize: '0.9rem'
                      }}
                    ></i>
                    <div>
                      <label
                        style={{
                          fontWeight: '600',
                          color: '#675541',
                          fontSize: '0.9rem'
                        }}
                      >
                        Status:
                      </label>
                      <p style={{ margin: '0.25rem 0 0 0' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor:
                              user?.status === 'active'
                                ? '#28a745'
                                : '#ffc107',
                            color: 'white',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
                        >
                          {user?.status?.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <h3
                style={{
                  marginBottom: '1.8rem',
                  color: '#675541',
                  fontSize: '1.7rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-user-edit"></i>
                Edit Profile
              </h3>

              <div style={{ display: 'grid', gap: '1.3rem' }}>
                {[
                  { label: 'Name', field: 'name', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phone', type: 'tel' }
                ].map((input) => (
                  <div key={input.field}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#675541'
                      }}
                    >
                      {input.label}:
                    </label>
                    <input
                      type={input.type}
                      value={formData[input.field]}
                      onChange={(e) =>
                        this.setState({
                          formData: {
                            ...formData,
                            [input.field]: e.target.value
                          }
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        border: '2px solid rgba(170,141,111,0.3)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#aa8d6f';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(170,141,111,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor =
                          'rgba(170,141,111,0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: '#675541'
                    }}
                  >
                    Address:
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      this.setState({
                        formData: { ...formData, address: e.target.value }
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem',
                      border: '2px solid rgba(170,141,111,0.3)',
                      borderRadius: '10px',
                      minHeight: '100px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#aa8d6f';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(170,141,111,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor =
                        'rgba(170,141,111,0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '2rem'
                }}
              >
                <button
                  type="submit"
                  style={{
                    background:
                      'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem 1.8rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(40,167,69,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fas fa-save"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => this.setState({ isEditing: false })}
                  style={{
                    background:
                      'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem 1.8rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(108,117,125,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default withAuthUser(Profile);
