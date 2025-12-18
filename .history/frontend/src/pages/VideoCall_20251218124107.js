import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, onClose }) => (
  <div style={{
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
    color: type === 'success' ? '#155724' : '#721c24',
    border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span>{message}</span>
    <button onClick={onClose} style={{ 
      background: 'none', 
      border: 'none', 
      fontSize: '1.2rem', 
      cursor: 'pointer',
      color: 'inherit'
    }}>×</button>
  </div>
);

const VideoCall = () => {
  const [classData, setClassData] = useState({
    _id: '1',
    name: 'Contemporary Dance Masterclass',
    instructor: 'Sarah Martinez',
    mode: 'online',
    schedule: {
      time: 'Mon, Wed, Fri - 6:00 PM',
      duration: 60
    },
    capacity: 20,
    enrolled: Array(12).fill(null),
    meetingId: '123-456-789',
    meetingPassword: 'dance2024',
    meetingLink: 'https://meet.google.com/sample-link'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isClassTime, setIsClassTime] = useState(true);

  useEffect(() => {
    checkClassTime();
  }, []);

  const checkClassTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    setIsClassTime(currentHour >= 8 && currentHour <= 22);
  };

  const joinMeeting = () => {
    if (classData?.meetingLink) {
      window.open(classData.meetingLink, '_blank');
    } else {
      setAlert({ message: 'Meeting link not available', type: 'error' });
    }
  };

  const goBack = () => {
    setAlert({ message: 'Navigation would go back to dashboard', type: 'success' });
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
        Loading class details...
      </div>
    );
  }

  if (!classData) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#675541', marginBottom: '2rem' }}>Class not found</h3>
          <button 
            onClick={goBack} 
            style={{
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(40px)'
        }}></div>
        
        <div style={{ position: 'relative' }}>
          <i className="fas fa-video" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.9 }}></i>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            {classData.name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95, margin: 0 }}>
            <i className="fas fa-laptop-house" style={{ marginRight: '0.5rem' }}></i>
            Online Dance Class
          </p>
        </div>
      </div>

      {/* Class Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[
          { value: classData.instructor, label: 'Instructor', icon: 'fas fa-user-tie', color: '#007bff' },
          { value: classData.schedule?.time || 'N/A', label: 'Schedule', icon: 'fas fa-clock', color: '#28a745' },
          { value: `${classData.schedule?.duration || 0} min`, label: 'Duration', icon: 'fas fa-hourglass-half', color: '#ffc107' },
          { value: `${classData.enrolled?.length || 0}/${classData.capacity}`, label: 'Participants', icon: 'fas fa-users', color: '#6f42c1' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
            padding: '1.75rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(170,141,111,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(103,85,65,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(103,85,65,0.15)';
          }}>
            <i className={stat.icon} style={{ fontSize: '2rem', color: stat.color, marginBottom: '0.75rem' }}></i>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Meeting Details */}
      {classData.meetingId && (
        <div style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(33,150,243,0.2)',
          border: '2px solid rgba(33,150,243,0.3)'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0', 
            color: '#1565c0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-info-circle"></i>
            Meeting Details
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '1rem',
            backgroundColor: 'rgba(255,255,255,0.6)',
            padding: '1.5rem',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
              <i className="fas fa-hashtag" style={{ color: '#1976d2' }}></i>
              <strong style={{ color: '#1565c0' }}>Meeting ID:</strong> 
              <span style={{ color: '#424242' }}>{classData.meetingId}</span>
            </div>
            {classData.meetingPassword && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                <i className="fas fa-lock" style={{ color: '#1976d2' }}></i>
                <strong style={{ color: '#1565c0' }}>Password:</strong> 
                <span style={{ color: '#424242' }}>{classData.meetingPassword}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Class Status & Join Button */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)',
        textAlign: 'center'
      }}>
        {isClassTime ? (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
              color: '#155724',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '2px solid #b1dfbb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              <i className="fas fa-circle" style={{ fontSize: '0.8rem', animation: 'pulse 2s infinite' }}></i>
              Class is live! You can join now.
            </div>
            
            <button
              onClick={joinMeeting}
              disabled={!classData.meetingLink}
              style={{
                background: classData.meetingLink 
                  ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)'
                  : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: 'white',
                border: 'none',
                padding: '1.25rem 3rem',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: classData.meetingLink ? 'pointer' : 'not-allowed',
                boxShadow: classData.meetingLink 
                  ? '0 6px 20px rgba(40,167,69,0.4)'
                  : '0 4px 12px rgba(108,117,125,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                if (classData.meetingLink) {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 8px 24px rgba(40,167,69,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (classData.meetingLink) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
                }
              }}
            >
              <i className="fas fa-video"></i>
              Join Video Call
            </button>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
            color: '#856404',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '2px solid #ffd89b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            <i className="fas fa-clock"></i>
            Class is not currently live. Please join at the scheduled time.
          </div>
        )}
      </div>

      {/* Before Joining Checklist */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-clipboard-check"></i>
          Before Joining
        </h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: '1rem'
        }}>
          {[
            { icon: 'fas fa-wifi', text: 'Ensure you have a stable internet connection' },
            { icon: 'fas fa-video', text: 'Test your camera and microphone' },
            { icon: 'fas fa-volume-up', text: 'Find a quiet space with good lighting' },
            { icon: 'fas fa-walking', text: 'Have enough room to move around safely' },
            { icon: 'fas fa-tint', text: 'Keep water nearby to stay hydrated' }
          ].map((item, index) => (
            <li key={index} style={{
              backgroundColor: 'rgba(170,141,111,0.1)',
              padding: '1.25rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(170,141,111,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.15)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <i className={item.icon} style={{ fontSize: '1.5rem', color: '#aa8d6f', minWidth: '24px' }}></i>
              <span style={{ color: '#675541', fontSize: '1rem' }}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-bolt"></i>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('https://meet.google.com/new', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(66,133,244,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(66,133,244,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(66,133,244,0.3)';
            }}
          >
            <i className="fab fa-google"></i>
            Test Google Meet
          </button>
          <button
            onClick={() => window.open('https://zoom.us/test', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #2d8cff 0%, #0b5cff 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(45,140,255,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(45,140,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(45,140,255,0.3)';
            }}
          >
            <i className="fas fa-video"></i>
            Test Zoom
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={goBack}
          style={{
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(108,117,125,0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(108,117,125,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(108,117,125,0.3)';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default VideoCall;