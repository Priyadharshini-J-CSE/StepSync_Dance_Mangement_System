import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideoCall = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [joinTime, setJoinTime] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const response = await axios.get(`/api/classes`);
      const foundClass = response.data.find(c => c._id === classId);
      setClassData(foundClass);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setLoading(false);
    }
  };

  const joinMeeting = () => {
    setIsJoined(true);
    setJoinTime(new Date());
    // Simulate adding user to participants
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      setParticipants(prev => [...prev, { id: user._id, name: user.name, role: user.role }]);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const message = {
        id: Date.now(),
        sender: user.name || 'Anonymous',
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

  const leaveCall = async () => {
    if (joinTime) {
      const leaveTime = new Date();
      const duration = Math.floor((leaveTime - joinTime) / 1000 / 60); // minutes
      
      // Mark attendance if joined for at least 5 minutes
      if (duration >= 5) {
        try {
          await axios.post('/api/attendance', {
            classId: classId,
            date: new Date().toISOString().split('T')[0],
            status: 'present'
          });
        } catch (error) {
          console.error('Error marking attendance:', error);
        }
      }
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
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
        flexDirection: 'column'
      }}>
        <h2>Class not found</h2>
        <button onClick={leaveCall} style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer'
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
        backgroundColor: '#2d2d2d',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>{classData.name}</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#ccc' }}>
            {classData.instructor} • {classData.schedule.time}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#28a745' }}>● LIVE</span>
          <button
            onClick={leaveCall}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Exit
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
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
                padding: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#2d2d2d',
                  padding: '2rem',
                  borderRadius: '8px',
                  maxWidth: '400px'
                }}>
                  <h3>Ready to join?</h3>
                  <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                    Make sure your camera and microphone are working properly before joining the class.
                  </p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4>Pre-class Checklist:</h4>
                    <ul style={{ textAlign: 'left', color: '#ccc' }}>
                      <li>Stable internet connection</li>
                      <li>Comfortable workout space</li>
                      <li>Water bottle nearby</li>
                      <li>Camera and microphone ready</li>
                    </ul>
                  </div>

                  <button
                    onClick={joinMeeting}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    🎥 Join Class Now
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
                backgroundColor: '#333'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '200px',
                    height: '150px',
                    backgroundColor: '#555',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    {isVideoOff ? '📹' : '👤'}
                  </div>
                  <p>You are connected to the meeting</p>
                  <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    Meeting opened in new tab. Use controls below to manage your session.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {isJoined && (
            <div style={{
              backgroundColor: '#2d2d2d',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={toggleMute}
                style={{
                  backgroundColor: isMuted ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px'
                }}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={toggleVideo}
                style={{
                  backgroundColor: isVideoOff ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px'
                }}
              >
                {isVideoOff ? '📹' : '🎥'}
              </button>
              <button
                onClick={leaveCall}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer'
                }}
              >
                Leave Call
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: '#2d2d2d',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Participants */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Participants ({participants.length})</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {participants.map(participant => (
                <div key={participant.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#3d3d3d',
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}>
                    {participant.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem' }}>{participant.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#ccc' }}>
                      {participant.role === 'admin' ? 'Instructor' : 'Student'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
              <h4 style={{ margin: 0 }}>Chat</h4>
            </div>
            
            <div style={{ 
              flex: 1, 
              padding: '1rem', 
              overflowY: 'auto',
              maxHeight: '300px'
            }}>
              {chatMessages.map(message => (
                <div key={message.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#ccc',
                    marginBottom: '0.25rem'
                  }}>
                    {message.sender} • {message.timestamp}
                  </div>
                  <div style={{ 
                    backgroundColor: '#3d3d3d',
                    padding: '0.5rem',
                    borderRadius: '4px'
                  }}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              padding: '1rem',
              borderTop: '1px solid #444',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#3d3d3d',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;