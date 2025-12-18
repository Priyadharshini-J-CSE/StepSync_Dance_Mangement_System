import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../components/Alert';

const ClassRegister = () => {
  const [classes, setClasses] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
    fetchMyRequests();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await axios.get('/api/classes/my-requests');
      setMyRequests(response.data);
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const handleRegister = async (classId, packageType) => {
    const selectedClass = classes.find(c => c._id === classId);
    
    // Check for time conflicts
    const hasTimeConflict = myRequests.some(request => {
      if (request.status === 'rejected' || !request.class) return false;
      return request.class.schedule.time === selectedClass.schedule.time;
    });
    
    if (hasTimeConflict) {
      setAlert({ message: 'You already have a class at this time. Please choose a different time slot.', type: 'error' });
      return;
    }
    
    try {
      await axios.post(`/api/classes/${classId}/request`, { package: packageType });
      setAlert({ message: 'Registration request submitted! Please proceed to payment.', type: 'success' });
      navigate(`/user/payment/${classId}?package=${packageType}`);
      fetchMyRequests(); // Refresh the requests list
    } catch (error) {
      console.error('Error registering for class:', error);
      setAlert({ message: error.response?.data?.message || 'Registration failed', type: 'error' });
    }
  };

  // Filter out classes user has already registered for (except rejected ones)
  const availableClasses = classes.filter(classItem => {
    return !myRequests.some(request => 
      request.class && request.class._id === classItem._id && request.status !== 'rejected'
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'accepted': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-info-circle';
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
        Loading classes...
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
        <i className="fas fa-graduation-cap"></i>
        Available Zumba Classes
      </h2>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {availableClasses.length === 0 ? (
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
          <h3 style={{ color: '#675541', marginBottom: '1rem' }}>No new classes available</h3>
          <p style={{ color: '#888' }}>You have registered for all available classes or check back later for new classes!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '2rem', 
          marginTop: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {availableClasses.map(classItem => (
            <div key={classItem._id} style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
              border: '1px solid rgba(170,141,111,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(103,85,65,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(103,85,65,0.15)';
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.75rem 0', 
                  color: '#675541',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-music" style={{ color: '#aa8d6f' }}></i>
                  {classItem.name}
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: '0 0 1rem 0',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {classItem.description}
                </p>
              </div>

              <div style={{ 
                marginBottom: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '12px',
                border: '1px solid rgba(170,141,111,0.1)'
              }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-user-tie" style={{ color: '#aa8d6f', width: '20px' }}></i>
                  <strong style={{ color: '#675541' }}>Instructor:</strong> 
                  <span style={{ color: '#666' }}>{classItem.instructor || 'TBA'}</span>
                </div>
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock" style={{ color: '#aa8d6f', width: '20px' }}></i>
                  <strong style={{ color: '#675541' }}>Schedule:</strong> 
                  <span style={{ color: '#666' }}>{classItem.schedule.time} ({classItem.schedule.duration} minutes)</span>
                </div>
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className={classItem.mode === 'online' ? 'fas fa-laptop' : 'fas fa-building'} style={{ color: '#aa8d6f', width: '20px' }}></i>
                  <strong style={{ color: '#675541' }}>Mode:</strong>
                  <span style={{
                    backgroundColor: classItem.mode === 'online' ? '#007bff' : '#28a745',
                    color: 'white',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    <i className={classItem.mode === 'online' ? 'fas fa-globe' : 'fas fa-map-marker-alt'} style={{ marginRight: '0.35rem' }}></i>
                    {classItem.mode === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-users" style={{ color: '#aa8d6f', width: '20px' }}></i>
                  <strong style={{ color: '#675541' }}>Capacity:</strong> 
                  <span style={{ 
                    color: classItem.enrolled?.length >= classItem.capacity ? '#dc3545' : '#666',
                    fontWeight: classItem.enrolled?.length >= classItem.capacity ? '600' : 'normal'
                  }}>
                    {classItem.enrolled?.length || 0}/{classItem.capacity}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-calendar-week" style={{ color: '#aa8d6f', width: '20px' }}></i>
                  <strong style={{ color: '#675541' }}>Days:</strong> 
                  <span style={{ color: '#666' }}>{classItem.schedule.days?.join(', ') || 'To be announced'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#675541',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-box-open"></i>
                  Package Options:
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {classItem.packages.map(pkg => (
                    <div key={pkg.type} style={{
                      padding: '1.5rem',
                      border: '2px solid rgba(170,141,111,0.3)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#aa8d6f';
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(170,141,111,0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '700', 
                          marginBottom: '0.5rem',
                          color: '#675541',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <i className="fas fa-tag" style={{ color: '#aa8d6f' }}></i>
                          {pkg.type === '3month' ? '3 Month Package' : '1 Year Package'}
                        </div>
                        <div style={{ color: '#888', fontSize: '0.9rem' }}>
                          {pkg.type === '3month' ? 'Perfect for beginners' : 'Best value for regular dancers'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.8rem', 
                          fontWeight: 'bold', 
                          color: '#aa8d6f',
                          marginBottom: '0.75rem'
                        }}>
                          ${pkg.price}
                        </div>
                        <button
                          onClick={() => handleRegister(classItem._id, pkg.type)}
                          disabled={classItem.enrolled?.length >= classItem.capacity}
                          style={{
                            background: classItem.enrolled?.length >= classItem.capacity 
                              ? 'linear-gradient(135deg, #999 0%, #777 100%)' 
                              : 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: classItem.enrolled?.length >= classItem.capacity ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            if (classItem.enrolled?.length < classItem.capacity) {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
                          }}
                        >
                          {classItem.enrolled?.length >= classItem.capacity ? (
                            <>
                              <i className="fas fa-ban"></i>
                              Full
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check-circle"></i>
                              Register
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {classItem.enrolled?.length >= classItem.capacity && (
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                  color: '#721c24',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: '1px solid #f5c6cb'
                }}>
                  <i className="fas fa-exclamation-triangle"></i>
                  This class is currently full. Please check back later or contact admin.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* My Registered Classes */}
      {myRequests.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ 
            color: '#675541', 
            fontSize: '2rem', 
            marginBottom: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="fas fa-clipboard-list"></i>
            My Registered Classes
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem', 
            marginTop: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}>
            {myRequests.map(request => (
              <div key={request._id} style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
                border: `2px solid ${getStatusColor(request.status)}`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(103,85,65,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(103,85,65,0.15)';
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#675541',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fa-solid fa-people-pulling" style={{ color: '#aa8d6f' }}></i>
                  {request.class?.name || 'Unknown Class'}
                </h4>
                
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-box" style={{ color: '#aa8d6f', width: '18px' }}></i>
                  <strong style={{ color: '#675541' }}>Package:</strong> 
                  <span style={{ color: '#666' }}>{request.package === '3month' ? '3 Months' : '1 Year'}</span>
                </div>
                
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock" style={{ color: '#aa8d6f', width: '18px' }}></i>
                  <strong style={{ color: '#675541' }}>Schedule:</strong> 
                  <span style={{ color: '#666' }}>{request.class?.schedule?.time || 'N/A'}</span>
                </div>
                
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-calendar-day" style={{ color: '#aa8d6f', width: '18px' }}></i>
                  <strong style={{ color: '#675541' }}>Request Date:</strong> 
                  <span style={{ color: '#666' }}>{new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
                
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: getStatusColor(request.status),
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  marginTop: '0.5rem',
                  boxShadow: `0 4px 12px ${getStatusColor(request.status)}40`
                }}>
                  <i className={getStatusIcon(request.status)}></i>
                  {request.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRegister;