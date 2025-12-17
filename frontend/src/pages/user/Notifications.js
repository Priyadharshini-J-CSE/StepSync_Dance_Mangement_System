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
        return '';
      case 'class_rejected':
        return '';
      case 'class_created':
        return '';
      case 'class_updated':
        return '';
      case 'class_deleted':
        return '';
      default:
        return '';
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
    return <div>Loading notifications...</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      
      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
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
                  backgroundColor: notification.isRead ? 'white' : '#f8f9fa',
                  padding: '2rem',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  cursor: notification.isRead ? 'default' : 'pointer',
                  border: notification.isRead ? '1px solid #dee2e6' : '2px solid #007bff',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {!notification.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%'
                  }}></div>
                )}

                <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    minWidth: '3rem',
                    textAlign: 'center'
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        color: '#333',
                        fontSize: '1.3rem'
                      }}>
                        {notificationInfo.title}
                      </h3>
                      
                      <p style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#666',
                        lineHeight: '1.5'
                      }}>
                        {notificationInfo.description}
                      </p>

                      {notificationInfo.action && (
                        <p style={{ 
                          margin: '0.5rem 0 0 0', 
                          color: '#007bff',
                          fontSize: '0.9rem',
                          fontStyle: 'italic'
                        }}>
                          {notificationInfo.action}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        backgroundColor: getNotificationColor(notification.type),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.8rem', 
                          color: '#999' 
                        }}>
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special styling for acceptance notifications */}
                {notification.type === 'class_accepted' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#d4edda',
                    borderRadius: '8px',
                    border: '1px solid #c3e6cb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#155724' }}>Congratulations!</strong>
                    </div>
                    <p style={{ margin: 0, color: '#155724', fontSize: '0.9rem' }}>
                      Your profile status has been updated to <strong>ACTIVE</strong>. You can now fully access all class features and start your Zumba journey!
                    </p>
                  </div>
                )}

                {notification.type === 'class_rejected' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#721c24' }}>Refund Processed</strong>
                    </div>
                    <p style={{ margin: 0, color: '#721c24', fontSize: '0.9rem' }}>
                      Your payment has been automatically refunded. Please allow 3-5 business days for the refund to appear in your account.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;