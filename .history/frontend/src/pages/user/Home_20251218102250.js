import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [onlineClasses, setOnlineClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    fetchOnlineClasses();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/attendance/user/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.slice(0, 5)); // Get recent 5 notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchOnlineClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      const enrolledOnlineClasses = response.data.filter(c => 
        c.mode === 'online' && c.enrolled && c.enrolled.includes(localStorage.getItem('userId'))
      );
      setOnlineClasses(enrolledOnlineClasses);
    } catch (error) {
      console.error('Error fetching online classes:', error);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', feedback);
      alert('Feedback submitted successfully!');
      setFeedback({ rating: 5, comment: '' });
    } catch (error) {
      alert('Failed to submit feedback');
    }
  };

  const renderStarRating = (rating, onChange) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => onChange && onChange(star)}
            style={{
              fontSize: '1.5rem',
              color: star <= rating ? '#ffc107' : '#e0e0e0',
              cursor: onChange ? 'pointer' : 'default'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ color: '#675541ff', fontSize: '2rem' , marginBottom:'1rem'}}>Dashboard</h2>
      
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
        color: '#675541ff'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#675541ff'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0',  }}>Total Classes</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold',color: '#675541ff' }}>
            {stats.totalClasses || 0}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#675541ff' }}>Classes Attended</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#675541ff' }}>
            {stats.presentClasses || 0}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#675541ff' }}>Attendance Rate</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold',color: '#675541ff' }}>
            {stats.attendanceRate || 0}%
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#675541ff' }}>This Month</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#675541ff' }}>
            {stats.monthlyAttendance || 0}
          </div>
        </div>
      </div>

      {/* Online Classes */}
      {onlineClasses.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>My Online Classes</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {onlineClasses.map(classItem => (
              <div key={classItem._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{classItem.name}</h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    🌐 Online • {classItem.schedule.time} • {classItem.instructor}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/user/video-call/${classItem._id}`)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🎥 Join Class
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Progress Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Progress Overview</h3>
          <div style={{ position: 'relative', height: '200px' }}>
            {/* Simple Progress Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Attendance Rate</span>
                <span>{stats.attendanceRate}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats.attendanceRate}%`,
                  height: '100%',
                  backgroundColor: '#675541ff',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Monthly Goal</span>
                <span>{Math.min(stats.monthlyAttendance * 10, 100)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(stats.monthlyAttendance * 10, 100)}%`,
                  height: '100%',
                  backgroundColor: '#675541ff',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Recent Notifications</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>No recent notifications</p>
            ) : (
              notifications.map(notification => (
                <div key={notification._id} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: notification.isRead ? '#f8f9fa' : '#f0f0f0',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${notification.isRead ? '#999' : '#333'}`
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Share Your Feedback</h3>
        <form onSubmit={submitFeedback}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Rating:
            </label>
            {renderStarRating(feedback.rating, (rating) => setFeedback({...feedback, rating}))}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Comment:
            </label>
            <textarea
              value={feedback.comment}
              onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
              required
              placeholder="Share your experience with our Zumba classes..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              backgroundColor:,
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;