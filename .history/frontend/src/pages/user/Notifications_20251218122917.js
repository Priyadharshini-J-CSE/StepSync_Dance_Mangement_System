import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'class_accepted':
        return 'fas fa-check-circle';
      case 'class_rejected':
        return 'fas fa-times-circle';
      case 'class_created':
        return 'fas fa-plus-circle';
      case 'class_updated':
        return 'fas fa-edit';
      case 'class_deleted':
        return 'fas fa-trash-alt';
      default:
        return 'fas fa-bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
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

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'class_accepted':
        return {
          title: 'Class Registration Approved',
          description: 'Your registration has been approved. Your profile is now active and you can start attending classes.',
          action: 'You can now view your class schedule in the Calendar section.'
        };
      case 'class_rejected':
        return {
          title: 'Class Registration Declined',
          description: 'Unfortunately, your class registration was not approved. Your payment has been refunded.',
          action: 'You can try registering for other available classes.'
        };
      case 'class_created':
        return {
          title: 'New Class Available',
          description: `A new class "${notification.relatedClass?.name}" has been created.`,
          action: 'Check out the new class in the Class Register section.'
        };
      case 'class_updated':
        return {
          title: 'Class Updated',
          description: `The class "${notification.relatedClass?.name}" has been updated.`,
          action: 'Please check the updated class details.'
        };
      case 'class_deleted':
        return {
          title: 'Class Cancelled',
          description: `The class "${notification.relatedClass?.name}" has been cancelled.`,
          action: 'Please contact admin for more information or refund details.'
        };
      default:
        return {
          title: 'Notification',
          description: notification.message,
          action: ''
        };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#675541'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Loading notifications...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ 
        color: '#675541', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(103,85,65,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <i className="fas fa-bell"></i>
        Notifications
      </h2>
      
      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          borderRadius: '16px',
          marginTop: '2rem',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '4rem', color: '#aa8d6f', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#675541', marginBottom: '0.5rem' }}>No notifications</h3>
          <p style={{ color: '#888' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {notifications.map(notification => {
            const notificationInfo = getNotificationMessage(notification);
            
            return (
              <div 
                key={notification._id} 
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                style={{
                  background: notification.isRead 
                    ? 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)' 
                    : 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  boxShadow: notification.isRead 
                    ? '0 4px 12px rgba(103,85,65,0.1)' 
                    : '0 8px 20px rgba(170,141,111,0.25)',
                  cursor: notification.isRead ? 'default' : 'pointer',
                  border: notification.isRead 
                    ? '1px solid rgba(170,141,111,0.2)' 
                    : '2px solid #aa8d6f',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!notification.isRead) {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(170,141,111,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!notification.isRead) {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(170,141,111,0.25)';
                  }
                }}
              >
                {!notification.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#aa8d6f',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 4px rgba(170,141,111,0.2)',
                    animation: 'pulse 2s infinite'
                  }}></div>
                )}

                <div style={{ display: 'flex', alignItems: 'start', gap: '2rem' }}>
                  <div style={{ 
                    fontSize: '3rem',
                    minWidth: '4rem',
                    textAlign: 'center',
                    color: getNotificationColor(notification.type)
                  }}>
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ 
                        margin: '0 0 0.75rem 0', 
                        fontWeight: notification.isRead ? '600' : '700',
                        color: '#675541',
                        fontSize: '1.5rem'
                      }}>
                        {notificationInfo.title}
                      </h3>
                      
                      <p style={{ 
                        margin: '0 0 0.75rem 0', 
                        color: '#666',
                        lineHeight: '1.6',
                        fontSize: '1rem'
                      }}>
                        {notificationInfo.description}
                      </p>

                      {notificationInfo.action && (
                        <p style={{ 
                          margin: '0.75rem 0 0 0', 
                          color: '#aa8d6f',
                          fontSize: '0.95rem',
                          fontStyle: 'italic',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                          {notificationInfo.action}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: getNotificationColor(notification.type),
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: `0 4px 12px ${getNotificationColor(notification.type)}40`
                      }}>
                        <i className={getNotificationIcon(notification.type)}></i>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </div>
                      
                      <div style={{ 
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <i className="fas fa-clock" style={{ color: '#999', fontSize: '0.9rem' }}></i>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.9rem', 
                          color: '#999',
                          fontWeight: '500'
                        }}>
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special styling for acceptance notifications */}
                {notification.type === 'class_accepted' && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    borderRadius: '12px',
                    border: '2px solid #b1dfbb',
                    boxShadow: '0 4px 12px rgba(40,167,69,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <i className="fas fa-trophy" style={{ color: '#155724', fontSize: '1.3rem' }}></i>
                      <strong style={{ color: '#155724', fontSize: '1.1rem' }}>Congratulations!</strong>
                    </div>
                    <p style={{ margin: 0, color: '#155724', fontSize: '1rem', lineHeight: '1.5' }}>
                      Your profile status has been updated to <strong>ACTIVE</strong>. You can now fully access all class features and start your Zumba journey!
                    </p>
                  </div>
                )}

                {notification.type === 'class_rejected' && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                    borderRadius: '12px',
                    border: '2px solid #f1aeb5',
                    boxShadow: '0 4px 12px rgba(220,53,69,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <i className="fas fa-undo" style={{ color: '#721c24', fontSize: '1.3rem' }}></i>
                      <strong style={{ color: '#721c24', fontSize: '1.1rem' }}>Refund Processed</strong>
                    </div>
                    <p style={{ margin: 0, color: '#721c24', fontSize: '1rem', lineHeight: '1.5' }}>
                      Your payment has been automatically refunded. Please allow 3-5 business days for the refund to appear in your account.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(170,141,111,0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(170,141,111,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(170,141,111,0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;