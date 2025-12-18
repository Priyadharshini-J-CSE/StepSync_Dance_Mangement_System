import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../components/Alert';

const VideoCall = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isClassTime, setIsClassTime] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchClassData();
    checkClassTime();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const response = await axios.get('/api/classes');
      const selectedClass = response.data.find(c => c._id === classId);
      
      if (!selectedClass) {
        setAlert({ message: 'Class not found', type: 'error' });
        return;
      }
      
      if (selectedClass.mode !== 'online') {
        setAlert({ message: 'This is not an online class', type: 'error' });
        return;
      }
      
      setClassData(selectedClass);
      setLoading(false);
    } catch (error) {
      setAlert({ message: 'Error loading class data', type: 'error' });
      setLoading(false);
    }
  };

  const checkClassTime = () => {
    // Simple time check - in real app, you'd check against actual schedule
    const now = new Date();
    const currentHour = now.getHours();
    // Allow joining 15 minutes before and after scheduled time
    setIsClassTime(currentHour >= 8 && currentHour <= 22); // Allow most of the day for demo
  };

  const joinMeeting = () => {
    if (classData?.meetingLink) {
      window.open(classData.meetingLink, '_blank');
    } else {
      setAlert({ message: 'Meeting link not available', type: 'error' });
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading class details...</div>;
  }

  if (!classData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Class not found</h3>
        <button onClick={() => navigate('/user')} style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>{classData.name}</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Online Dance Class</p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Instructor:</strong>
              <div>{classData.instructor}</div>
            </div>
            <div>
              <strong>Schedule:</strong>
              <div>{classData.schedule.time}</div>
            </div>
            <div>
              <strong>Duration:</strong>
              <div>{classData.schedule.duration} minutes</div>
            </div>
            <div>
              <strong>Participants:</strong>
              <div>{classData.enrolled?.length || 0}/{classData.capacity}</div>
            </div>
          </div>
        </div>

        {classData.meetingId && (
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Meeting Details</h4>
            <div><strong>Meeting ID:</strong> {classData.meetingId}</div>
            {classData.meetingPassword && (
              <div><strong>Password:</strong> {classData.meetingPassword}</div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          {isClassTime ? (
            <div>
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                🟢 Class is live! You can join now.
              </div>
              
              <button
                onClick={joinMeeting}
                disabled={!classData.meetingLink}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  cursor: classData.meetingLink ? 'pointer' : 'not-allowed',
                  marginRight: '1rem'
                }}
              >
                🎥 Join Video Call
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              ⏰ Class is not currently live. Please join at the scheduled time.
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h4 style={{ marginTop: 0 }}>Before joining:</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Ensure you have a stable internet connection</li>
            <li>Test your camera and microphone</li>
            <li>Find a quiet space with good lighting</li>
            <li>Have enough room to move around safely</li>
            <li>Keep water nearby to stay hydrated</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/user')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '1rem'
      }}>
        <h4 style={{ marginTop: 0 }}>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('https://meet.google.com/new', '_blank')}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Test Google Meet
          </button>
          <button
            onClick={() => window.open('https://zoom.us/test', '_blank')}
            style={{
              backgroundColor: '#2d8cff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Test Zoom
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;