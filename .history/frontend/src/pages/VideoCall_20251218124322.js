import React, { useState, useEffect } from 'react';

const VideoCall = () => {
  const [classData, setClassData] = useState({
    _id: '1',
    name: 'Contemporary Dance Masterclass',
    instructor: 'Sarah Martinez',
    mode: 'online',
    schedule: {
      time: 'Mon, Wed, Fri - 6:00 PM',
      duration: 60
    }
  });
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [joinTime, setJoinTime] = useState(null);

  const joinMeeting = () => {
    setIsJoined(true);
    setJoinTime(new Date());
    // Simulate adding user to participants
    setParticipants(prev => [...prev, { 
      id: '1', 
      name: 'Demo User', 
      role: 'student' 
    }]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'Demo User',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const leaveCall = () => {
    alert('Would navigate back to dashboard');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#675541'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Loading...
      </div>
    );
  }

  if (!classData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Class not found</h2>
        <button onClick={leaveCall} style={{
          background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(170,141,111,0.3)'
        }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #aa8d6f',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
            <i className="fas fa-video" style={{ marginRight: '0.75rem', color: '#aa8d6f' }}></i>
            {classData.name}
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#ccc', fontSize: '1rem' }}>
            <i className="fas fa-user-tie" style={{ marginRight: '0.5rem', color: '#aa8d6f' }}></i>
            {classData.instructor} • {classData.schedule.time}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ 
            color: '#28a745',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem'
          }}>
            <i className="fas fa-circle" style={{ fontSize: '0.7rem', animation: 'pulse 2s infinite' }}></i>
            LIVE
          </span>
          <button
            onClick={leaveCall}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(220,53,69,0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(220,53,69,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.4)';
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Exit
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main Video Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Video Container */}
          <div style={{
            flex: 1,
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            {!isJoined ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                maxWidth: '500px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
                  padding: '3rem',
                  borderRadius: '20px',
                  border: '2px solid #aa8d6f',
                  boxShadow: '0 12px 28px rgba(170,141,111,0.3)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem'
                  }}>
                    🎥
                  </div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>
                    Ready to join?
                  </h3>
                  <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
                    Make sure your camera and microphone are working properly before joining the class.
                  </p>
                  
                  <div style={{ 
                    marginBottom: '2rem',
                    textAlign: 'left',
                    background: 'rgba(170,141,111,0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(170,141,111,0.3)'
                  }}>
                    <h4 style={{ 
                      marginTop: 0,
                      marginBottom: '1rem',
                      color: '#aa8d6f',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className="fas fa-clipboard-check"></i>
                      Pre-class Checklist:
                    </h4>
                    <ul style={{ 
                      color: '#ccc',
                      paddingLeft: '1.5rem',
                      margin: 0,
                      lineHeight: '2'
                    }}>
                      <li><i className="fas fa-wifi" style={{ color: '#aa8d6f', marginRight: '0.5rem' }}></i>Stable internet connection</li>
                      <li><i className="fas fa-walking" style={{ color: '#aa8d6f', marginRight: '0.5rem' }}></i>Comfortable workout space</li>
                      <li><i className="fas fa-tint" style={{ color: '#aa8d6f', marginRight: '0.5rem' }}></i>Water bottle nearby</li>
                      <li><i className="fas fa-video" style={{ color: '#aa8d6f', marginRight: '0.5rem' }}></i>Camera and microphone ready</li>
                    </ul>
                  </div>

                  <button
                    onClick={joinMeeting}
                    style={{
                      background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1.25rem 2.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      boxShadow: '0 6px 20px rgba(40,167,69,0.4)',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 24px rgba(40,167,69,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
                    }}
                  >
                    <i className="fas fa-video"></i>
                    Join Class Now
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1a1a1a',
                backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, #2d2d2d 25%, #2d2d2d 50%, #1a1a1a 50%, #1a1a1a 75%, #2d2d2d 75%, #2d2d2d)',
                backgroundSize: '40px 40px'
              }}>
                <div style={{ 
                  textAlign: 'center',
                  background: 'rgba(45,45,45,0.9)',
                  padding: '3rem',
                  borderRadius: '20px',
                  border: '2px solid #aa8d6f',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    width: '200px',
                    height: '150px',
                    background: 'linear-gradient(135deg, #555 0%, #333 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '4rem',
                    border: '3px solid #aa8d6f',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
                  }}>
                    {isVideoOff ? '📹' : '👤'}
                  </div>
                  <p style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '0.5rem' }}></i>
                    You are connected
                  </p>
                  <p style={{ color: '#ccc', fontSize: '1rem', margin: 0 }}>
                    Meeting opened in new tab. Use controls below to manage your session.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {isJoined && (
            <div style={{
              background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              borderTop: '2px solid #aa8d6f',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
            }}>
              <button
                onClick={toggleMute}
                style={{
                  background: isMuted 
                    ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                    : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  width: '60px',
                  height: '60px',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className={isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone'}></i>
              </button>
              <button
                onClick={toggleVideo}
                style={{
                  background: isVideoOff 
                    ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                    : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  width: '60px',
                  height: '60px',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className={isVideoOff ? 'fas fa-video-slash' : 'fas fa-video'}></i>
              </button>
              <button
                onClick={leaveCall}
                style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(220,53,69,0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(220,53,69,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.4)';
                }}
              >
                <i className="fas fa-phone-slash"></i>
                Leave Call
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{
          width: '350px',
          background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '2px solid #aa8d6f'
        }}>
          {/* Participants */}
          <div style={{ padding: '1.5rem', borderBottom: '2px solid #444' }}>
            <h4 style={{ 
              margin: '0 0 1rem 0',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#aa8d6f'
            }}>
              <i className="fas fa-users"></i>
              Participants ({participants.length})
            </h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {participants.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                  No participants yet
                </p>
              ) : (
                participants.map(participant => (
                  <div key={participant.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#3d3d3d',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    border: '1px solid #555',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4d4d4d';
                    e.currentTarget.style.borderColor = '#aa8d6f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3d3d3d';
                    e.currentTarget.style.borderColor = '#555';
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '700',
                      border: '2px solid #675541'
                    }}>
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>{participant.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#aa8d6f' }}>
                        {participant.role === 'admin' ? '👨‍🏫 Instructor' : '🎓 Student'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '2px solid #444' }}>
              <h4 style={{ 
                margin: 0,
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#aa8d6f'
              }}>
                <i className="fas fa-comments"></i>
                Chat
              </h4>
            </div>
            
            <div style={{ 
              flex: 1, 
              padding: '1rem', 
              overflowY: 'auto',
              minHeight: 0
            }}>
              {chatMessages.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map(message => (
                  <div key={message.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#aa8d6f',
                      marginBottom: '0.25rem',
                      fontWeight: '600'
                    }}>
                      {message.sender} • {message.timestamp}
                    </div>
                    <div style={{ 
                      backgroundColor: '#3d3d3d',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #555',
                      lineHeight: '1.5'
                    }}>
                      {message.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ 
              padding: '1rem',
              borderTop: '2px solid #444',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#3d3d3d',
                  border: '2px solid #555',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#aa8d6f';
                  e.target.style.backgroundColor = '#4d4d4d';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#555';
                  e.target.style.backgroundColor = '#3d3d3d';
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                <i className="fas fa-paper-plane"></i>
                Send
              </button>
            </div>
          </div>
        </div>
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