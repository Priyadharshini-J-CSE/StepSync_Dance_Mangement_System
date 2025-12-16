import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassRegister = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
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

  const handleRegister = async (classId, packageType) => {
    try {
      await axios.post(`/api/classes/${classId}/request`, { package: packageType });
      alert('Registration request submitted! Please proceed to payment.');
      navigate(`/user/payment/${classId}?package=${packageType}`);
    } catch (error) {
      console.error('Error registering for class:', error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return <div>Loading classes...</div>;
  }

  return (
    <div>
      <h2>Available Zumba Classes</h2>
      
      {classes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No classes available</h3>
          <p>Check back later for new classes!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '2rem', 
          marginTop: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {classes.map(classItem => (
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
                  <strong>👨‍🏫 Instructor:</strong> {classItem.instructor || 'TBA'}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>⏰ Schedule:</strong> {classItem.schedule.time} ({classItem.schedule.duration} minutes)
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>👥 Capacity:</strong> {classItem.enrolled?.length || 0}/{classItem.capacity}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>📅 Days:</strong> {classItem.schedule.days?.join(', ') || 'To be announced'}
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
                          color: '#28a745',
                          marginBottom: '0.5rem'
                        }}>
                          ${pkg.price}
                        </div>
                        <button
                          onClick={() => handleRegister(classItem._id, pkg.type)}
                          disabled={classItem.enrolled?.length >= classItem.capacity}
                          style={{
                            backgroundColor: classItem.enrolled?.length >= classItem.capacity ? '#6c757d' : '#007bff',
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
                  ⚠️ This class is currently full. Please check back later or contact admin.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassRegister;