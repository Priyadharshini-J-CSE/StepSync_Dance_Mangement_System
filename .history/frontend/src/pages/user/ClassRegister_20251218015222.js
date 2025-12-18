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
      case 'pending': return '#999';
      case 'accepted': return '#666';
      case 'rejected': return '#333';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div>Loading classes...</div>;
  }

  return (
    <div>
      <h2>Available Zumba Classes</h2>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {loading ? (
        <div>Loading classes...</div>
      ) : availableClasses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No new classes available</h3>
          <p>You have registered for all available classes or check back later for new classes!</p>
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
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#333',
                  fontSize: '1.5rem'
                }}>
                  {classItem.name}
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: '0 0 1rem 0',
                  lineHeight: '1.5'
                }}>
                  {classItem.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Instructor:</strong> {classItem.instructor || 'TBA'}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Schedule:</strong> {classItem.schedule.time} ({classItem.schedule.duration} minutes)
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Mode:</strong> 
                  <span style={{
                    backgroundColor: classItem.mode === 'online' ? '#007bff' : '#28a745',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    marginLeft: '0.5rem'
                  }}>
                    {classItem.mode === 'online' ? '🌐 Online' : '🏢 Offline'}
                  </span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Capacity:</strong> {classItem.enrolled?.length || 0}/{classItem.capacity}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Days:</strong> {classItem.schedule.days?.join(', ') || 'To be announced'}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>Package Options:</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {classItem.packages.map(pkg => (
                    <div key={pkg.type} style={{
                      padding: '1rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {pkg.type === '3month' ? '3 Month Package' : '1 Year Package'}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          {pkg.type === '3month' ? 'Perfect for beginners' : 'Best value for regular dancers'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          color: '#333',
                          marginBottom: '0.5rem'
                        }}>
                          ${pkg.price}
                        </div>
                        <button
                          onClick={() => handleRegister(classItem._id, pkg.type)}
                          disabled={classItem.enrolled?.length >= classItem.capacity}
                          style={{
                            backgroundColor: classItem.enrolled?.length >= classItem.capacity ? '#999' : '#333',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: classItem.enrolled?.length >= classItem.capacity ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          {classItem.enrolled?.length >= classItem.capacity ? 'Full' : 'Register'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {classItem.enrolled?.length >= classItem.capacity && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  This class is currently full. Please check back later or contact admin.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* My Registered Classes */}
      {myRequests.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3>My Registered Classes</h3>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            marginTop: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}>
            {myRequests.map(request => (
              <div key={request._id} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: `2px solid ${getStatusColor(request.status)}`
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{request.class?.name || 'Unknown Class'}</h4>
                <p><strong>Package:</strong> {request.package === '3month' ? '3 Months' : '1 Year'}</p>
                <p><strong>Schedule:</strong> {request.class?.schedule?.time || 'N/A'}</p>
                <p><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(request.status),
                  color: 'white',
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}>
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