import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // Redirect based on notification type
    if (notification.type === 'class_request') {
      navigate('/admin/acceptance');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'class_request':
        return '📝';
      case 'class_accepted':
        return '✅';
      case 'class_rejected':
        return '❌';
      case 'class_created':
        return '🆕';
      case 'class_updated':
        return '📝';
      case 'class_deleted':
        return '🗑️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
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
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              onClick={() => handleNotificationClick(notification)}
              style={{
                backgroundColor: notification.isRead ? 'white' : '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: notification.type === 'class_request' ? 'pointer' : 'default',
                border: notification.isRead ? '1px solid #dee2e6' : '2px solid #007bff',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{ 
                  fontSize: '1.5rem',
                  minWidth: '2rem'
                }}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        color: '#333'
                      }}>
                        {notification.message}
                      </p>
                      
                      {notification.sender && (
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.9rem', 
                          color: '#666' 
                        }}>
                          From: {notification.sender.name}
                        </p>
                      )}
                      
                      {notification.relatedClass && (
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.9rem', 
                          color: '#666' 
                        }}>
                          Class: {notification.relatedClass.name}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: getNotificationColor(notification.type),
                        color: 'white',
                        fontSize: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </div>
                      
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem', 
                        color: '#999' 
                      }}>
                        {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {notification.type === 'class_request' && !notification.isRead && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#1976d2'
                }}>
                  💡 Click to review this request in the Acceptance page
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;