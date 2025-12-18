import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Small HOC to inject navigate into a class component
function withNavigation(Component) {
  return function Wrapped(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: true
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  fetchNotifications = async () => {
    this.setState({ loading: true });
    try {
      const response = await axios.get('/api/notifications');
      this.setState({ notifications: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      this.setState({ loading: false });
    }
  };

  markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      this.setState((prevState) => ({
        notifications: prevState.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  handleNotificationClick = (notification) => {
    const { navigate } = this.props;
    if (!notification.isRead) {
      this.markAsRead(notification._id);
    }

    if (notification.type === 'class_request') {
      navigate('/admin/acceptance');
    }
  };

  getNotificationIcon = (type) => {
    // You can put FontAwesome icons here if you want
    switch (type) {
      case 'class_request':
        return <i className="fas fa-envelope-open-text"></i>;
      case 'class_accepted':
        return <i className="fas fa-check-circle"></i>;
      case 'class_rejected':
        return <i className="fas fa-times-circle"></i>;
      case 'class_created':
        return <i className="fas fa-plus-circle"></i>;
      case 'class_updated':
        return <i className="fas fa-edit"></i>;
      case 'class_deleted':
        return <i className="fas fa-trash-alt"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  getNotificationColor = (type) => {
    switch (type) {
      case 'class_request':
        return '#007bff';
      case 'class_accepted':
        return '#28a745';
      case 'class_rejected':
        return '#dc3545';
      case 'class_created':
        return '#17a2b8';
      case 'class_updated':
        return '#ffc107';
      case 'class_deleted':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  render() {
    const { notifications, loading } = this.state;

    if (loading) {
      return (
        <div
          style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#675541',
            fontSize: '1.1rem'
          }}
        >
          <i
            className="fas fa-spinner fa-spin"
            style={{ marginRight: '0.5rem' }}
          ></i>
          Loading notifications...
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
            marginBottom: '3rem',
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '2.4rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <i className="fas fa-bell"></i>
                Notifications
              </h1>
              <p
                style={{
                  marginTop: '0.8rem',
                  fontSize: '1.05rem',
                  opacity: 0.95,
                  maxWidth: '520px'
                }}
              >
                Stay up to date with class requests, approvals, and updates in a
                unified notification center.
              </p>
            </div>

            <div
              style={{
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '1.75rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                minWidth: '220px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              <i
                className="fas fa-inbox"
                style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}
              ></i>
              <div
                style={{
                  fontSize: '1rem',
                  marginBottom: '0.3rem',
                  opacity: 0.9
                }}
              >
                Total Notifications
              </div>
              <div
                style={{
                  fontSize: '1.7rem',
                  fontWeight: 'bold',
                  marginBottom: '0.3rem'
                }}
              >
                {notifications.length}
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                Unread:{' '}
                {
                  notifications.filter((n) => !n.isRead)
                    .length
                }
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
              borderRadius: '16px',
              marginTop: '1rem',
              boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
              border: '1px solid rgba(170,141,111,0.2)'
            }}
          >
            <i
              className="fas fa-smile"
              style={{
                fontSize: '3rem',
                color: '#ddd',
                marginBottom: '1rem'
              }}
            ></i>
            <h3
              style={{
                marginBottom: '0.5rem',
                color: '#675541',
                fontSize: '1.5rem'
              }}
            >
              No notifications
            </h3>
            <p style={{ color: '#888', fontSize: '1rem' }}>
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {notifications.map((notification) => {
              const color = this.getNotificationColor(notification.type);
              const isUnread = !notification.isRead;

              return (
                <div
                  key={notification._id}
                  onClick={() =>
                    this.handleNotificationClick(notification)
                  }
                  style={{
                    background: isUnread
                      ? 'linear-gradient(135deg, #f8f6f3 0%, #f0e6da 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
                    cursor:
                      notification.type === 'class_request'
                        ? 'pointer'
                        : 'default',
                    border: isUnread
                      ? `2px solid ${color}`
                      : '1px solid rgba(170,141,111,0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.7rem',
                        minWidth: '2.2rem',
                        color
                      }}
                    >
                      {this.getNotificationIcon(notification.type)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: isUnread ? '600' : '500',
                              color: '#333',
                              fontSize: '0.98rem'
                            }}
                          >
                            {notification.message}
                          </p>

                          {notification.sender && (
                            <p
                              style={{
                                margin: '0.25rem 0 0 0',
                                fontSize: '0.9rem',
                                color: '#666'
                              }}
                            >
                              <i
                                className="fas fa-user"
                                style={{
                                  marginRight: '0.35rem',
                                  color: '#aa8d6f'
                                }}
                              ></i>
                              From: {notification.sender.name}
                            </p>
                          )}

                          {notification.relatedClass && (
                            <p
                              style={{
                                margin: '0.25rem 0 0 0',
                                fontSize: '0.9rem',
                                color: '#666'
                              }}
                            >
                              <i
                                className="fas fa-chalkboard"
                                style={{
                                  marginRight: '0.35rem',
                                  color: '#aa8d6f'
                                }}
                              ></i>
                              Class: {notification.relatedClass.name}
                            </p>
                          )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '12px',
                              backgroundColor: color,
                              color: 'white',
                              fontSize: '0.75rem',
                              marginBottom: '0.4rem',
                              fontWeight: '600'
                            }}
                          >
                            {notification.type
                              .replace('_', ' ')
                              .toUpperCase()}
                          </div>

                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.8rem',
                              color: '#999'
                            }}
                          >
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}{' '}
                            {new Date(
                              notification.createdAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {notification.type === 'class_request' && isUnread && (
                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '0.75rem 0.9rem',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <i className="fas fa-arrow-right"></i>
                          Click to review this request in the Acceptance page.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withNavigation(Notifications);
