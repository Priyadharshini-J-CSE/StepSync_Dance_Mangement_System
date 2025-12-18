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
      setNotifications(response.data.slice(0, 5));
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
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => onChange && onChange(star)}
            style={{
              fontSize: '2rem',
              color: star <= rating ? '#ffc107' : '#e0e0e0',
              cursor: onChange ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              textShadow: star <= rating ? '0 2px 4px rgba(255,193,7,0.3)' : 'none'
            }}
            onMouseEnter={(e) => onChange && (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => onChange && (e.target.style.transform = 'scale(1)')}
          >
            ★
          </span>
        ))}
      </div>
    );
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
        Loading dashboard...
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
        textShadow: '2px 2px 4px rgba(103,85,65,0.1)'
      }}>
        Dashboard
      </h2>
      
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {[
          { title: 'Total Classes', value: stats.totalClasses || 0, icon: 'fas fa-book' },
          { title: 'Classes Attended', value: stats.presentClasses || 0, icon: 'fas fa-check-circle' },
          { title: 'Attendance Rate', value: `${stats.attendanceRate || 0}%`, icon: 'fas fa-chart-bar' },
          { title: 'This Month', value: stats.monthlyAttendance || 0, icon: 'fas fa-calendar-alt' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(170,141,111,0.2)',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(103,85,65,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(103,85,65,0.15)';
          }}>
            <i className={stat.icon} style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#aa8d6f' }}></i>
            <h3 style={{ 
              margin: '0 0 0.75rem 0', 
              color: '#675541',
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {stat.title}
            </h3>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#aa8d6f',
              textShadow: '2px 2px 4px rgba(170,141,111,0.2)'
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Online Classes */}
      {onlineClasses.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          marginBottom: '3rem',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: '#675541',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-video"></i> My Online Classes
          </h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {onlineClasses.map(classItem => (
              <div key={classItem._id} style={{
                border: '2px solid rgba(170,141,111,0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#aa8d6f';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(170,141,111,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#675541',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    {classItem.name}
                  </h4>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.95rem' }}>
                    <i className="fas fa-globe"></i> Online • {classItem.schedule.time} • {classItem.instructor}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/user/video-call/${classItem._id}`)}
                  style={{
                    background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
                  }}
                >
                  <i className="fas fa-video" style={{ marginRight: '0.5rem' }}></i>
                  Join Class
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Progress Chart */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <h3 style={{ 
            marginBottom: '2rem', 
            color: '#675541',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-chart-line"></i> Progress Overview
          </h3>
          <div style={{ position: 'relative' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.75rem',
                color: '#675541',
                fontWeight: '600'
              }}>
                <span>Attendance Rate</span>
                <span style={{ color: '#aa8d6f', fontSize: '1.1rem' }}>{stats.attendanceRate}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '24px',
                backgroundColor: '#f0ede8',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: `${stats.attendanceRate}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #aa8d6f 0%, #8b7355 100%)',
                  transition: 'width 0.5s ease',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(170,141,111,0.4)'
                }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.75rem',
                color: '#675541',
                fontWeight: '600'
              }}>
                <span>Monthly Goal</span>
                <span style={{ color: '#aa8d6f', fontSize: '1.1rem' }}>
                  {Math.min(stats.monthlyAttendance * 10, 100)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '24px',
                backgroundColor: '#f0ede8',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: `${Math.min(stats.monthlyAttendance * 10, 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #aa8d6f 0%, #8b7355 100%)',
                  transition: 'width 0.5s ease',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(170,141,111,0.4)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: '#675541',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-bell"></i> Recent Notifications
          </h3>
          <div style={{ 
            maxHeight: '280px', 
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {notifications.length === 0 ? (
              <p style={{ 
                color: '#999', 
                textAlign: 'center',
                padding: '2rem',
                fontSize: '1rem'
              }}>
                No recent notifications
              </p>
            ) : (
              notifications.map(notification => (
                <div key={notification._id} style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: notification.isRead ? 'rgba(248,246,243,0.5)' : 'rgba(255,255,255,0.9)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${notification.isRead ? '#ccc' : '#aa8d6f'}`,
                  boxShadow: notification.isRead ? 'none' : '0 2px 8px rgba(170,141,111,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(170,141,111,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = notification.isRead ? 'none' : '0 2px 8px rgba(170,141,111,0.2)';
                }}>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: notification.isRead ? 'normal' : '600',
                    color: '#675541',
                    marginBottom: '0.5rem'
                  }}>
                    {notification.message}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#999'
                  }}>
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
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginBottom: '2rem', 
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-comments"></i> Share Your Feedback
        </h3>
        <form onSubmit={submitFeedback} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: '600',
              color: '#675541',
              fontSize: '1.1rem'
            }}>
              Rating:
            </label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {renderStarRating(feedback.rating, (rating) => setFeedback({...feedback, rating}))}
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: '600',
              color: '#675541',
              fontSize: '1.1rem'
            }}>
              Comment:
            </label>
            <textarea
              value={feedback.comment}
              onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
              required
              placeholder="Share your experience with our Zumba classes..."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid rgba(170,141,111,0.3)',
                borderRadius: '10px',
                minHeight: '120px',
                resize: 'vertical',
                backgroundColor: 'rgba(255,255,255,0.9)',
                fontSize: '1rem',
                fontFamily: 'inherit',
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
          
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              width: '100%',
              boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(170,141,111,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
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