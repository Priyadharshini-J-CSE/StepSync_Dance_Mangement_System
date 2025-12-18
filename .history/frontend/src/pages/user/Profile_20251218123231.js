import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [alert, setAlert] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const response = await axios.get('/api/attendance/user/profile');
      setProfileStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', formData);
      setIsEditing(false);
      setAlert({ message: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const renderStars = (stars) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className="fas fa-star" 
        style={{ 
          color: i < stars ? '#ffd700' : '#ddd', 
          fontSize: '1.5rem',
          marginRight: '0.25rem',
          textShadow: i < stars ? '0 2px 4px rgba(255,215,0,0.3)' : 'none'
        }}
      ></i>
    ));
  };

  const getRankColor = (rank, total) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return '#ffd700'; // Gold
    if (percentage <= 25) return '#c0c0c0'; // Silver
    if (percentage <= 50) return '#cd7f32'; // Bronze
    return '#666';
  };

  const getRankIcon = (rank, total) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return 'fas fa-trophy';
    if (percentage <= 25) return 'fas fa-medal';
    if (percentage <= 50) return 'fas fa-award';
    return 'fas fa-certificate';
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
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
        marginBottom: '3rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <i className="fas fa-user-circle" style={{ fontSize: '4rem', opacity: 0.9 }}></i>
              <h1 style={{ margin: 0, fontSize: '2.8rem', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                {user?.name}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', marginLeft: '5rem' }}>
              <div>{renderStars(profileStats?.starRating || 1)}</div>
              <div style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-coins"></i>
                {profileStats?.skillPoints || 0} Points
              </div>
            </div>
            <div style={{ 
              fontSize: '1.2rem', 
              opacity: 0.95,
              marginLeft: '5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className={getRankIcon(profileStats?.globalRank, profileStats?.totalUsers)}></i>
              Global Rank: #{profileStats?.globalRank || 'N/A'} of {profileStats?.totalUsers || 0}
            </div>
          </div>
          <div style={{ 
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '2rem',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            minWidth: '180px'
          }}>
            <i className="fas fa-graduation-cap" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></i>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {profileStats?.completedCourses || 0}
            </div>
            <div style={{ fontSize: '1.1rem' }}>Courses Completed</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {[
          { value: profileStats?.totalAttendance || 0, label: 'Total Classes', icon: 'fas fa-book', color: '#007bff' },
          { value: profileStats?.presentAttendance || 0, label: 'Classes Attended', icon: 'fas fa-check-circle', color: '#28a745' },
          { value: `${profileStats?.consistencyRate || 0}%`, label: 'Consistency', icon: 'fas fa-chart-line', color: '#ffc107' },
          { value: `#${profileStats?.globalRank || 'N/A'}`, label: 'Global Rank', icon: getRankIcon(profileStats?.globalRank, profileStats?.totalUsers), color: getRankColor(profileStats?.globalRank, profileStats?.totalUsers) }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
            padding: '2rem',
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
            <i className={stat.icon} style={{ fontSize: '2.5rem', color: stat.color, marginBottom: '0.75rem' }}></i>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '1rem', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-trophy"></i>
          Achievements & Badges
        </h3>
        {profileStats?.badges?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {profileStats.badges.map((badge, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                color: 'white',
                padding: '1rem 1.75rem',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: `0 4px 12px ${badge.color}40`,
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 6px 16px ${badge.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${badge.color}40`;
              }}>
                <i className={badge.icon || 'fas fa-award'} style={{ fontSize: '1.5rem' }}></i>
                {badge.name}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#888', 
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <i className="fas fa-medal" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p style={{ fontSize: '1.1rem' }}>Complete courses to earn badges!</p>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        marginBottom: '2rem',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h3 style={{ 
          marginBottom: '2rem',
          color: '#675541',
          fontSize: '1.8rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-fire"></i>
          Dance Skills
        </h3>
        {profileStats?.skills && Object.keys(profileStats.skills).length > 0 ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {Object.entries(profileStats.skills).map(([danceType, skill]) => (
              <div key={danceType} style={{
                border: '2px solid rgba(170,141,111,0.3)',
                borderRadius: '12px',
                padding: '2rem',
                backgroundColor: 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#aa8d6f';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(170,141,111,0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 0.75rem 0',
                      color: '#675541',
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className="fas fa-music" style={{ color: '#aa8d6f' }}></i>
                      {danceType}
                    </h4>
                    <div style={{ 
                      color: '#666',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-graduation-cap" style={{ color: '#aa8d6f' }}></i>
                        {skill.courses} courses
                      </span>
                      <span style={{ 
                        backgroundColor: '#aa8d6f',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                  <div>{renderStars(skill.stars)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#888', 
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <i className="fas fa-star" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p style={{ fontSize: '1.1rem' }}>Complete courses to develop your dance skills!</p>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#675541',
                fontSize: '1.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                margin: 0
              }}>
                <i className="fas fa-user-edit"></i>
                Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gap: '1.5rem',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(170,141,111,0.2)'
            }}>
              {[
                { icon: 'fas fa-user', label: 'Name', value: user?.name },
                { icon: 'fas fa-envelope', label: 'Email', value: user?.email },
                { icon: 'fas fa-phone', label: 'Phone', value: user?.phone || 'Not provided' },
                { icon: 'fas fa-map-marker-alt', label: 'Address', value: user?.address || 'Not provided' }
              ].map((field, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px'
                }}>
                  <i className={field.icon} style={{ color: '#aa8d6f', fontSize: '1.3rem', minWidth: '24px' }}></i>
                  <div>
                    <div style={{ fontWeight: '600', color: '#675541', marginBottom: '0.25rem' }}>{field.label}:</div>
                    <div style={{ color: '#666' }}>{field.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ 
              marginBottom: '2rem',
              color: '#675541',
              fontSize: '1.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <i className="fas fa-user-edit"></i>
              Edit Profile
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                { icon: 'fas fa-user', label: 'Name', type: 'text', field: 'name' },
                { icon: 'fas fa-envelope', label: 'Email', type: 'email', field: 'email' },
                { icon: 'fas fa-phone', label: 'Phone', type: 'tel', field: 'phone' }
              ].map((input, index) => (
                <div key={index}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.75rem', 
                    fontWeight: '600',
                    color: '#675541'
                  }}>
                    <i className={input.icon} style={{ color: '#aa8d6f' }}></i>
                    {input.label}:
                  </label>
                  <input
                    type={input.type}
                    value={formData[input.field]}
                    onChange={(e) => setFormData({...formData, [input.field]: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(170,141,111,0.3)',
                      borderRadius: '10px',
                      fontSize: '1rem',
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
              ))}
              
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: '#675541'
                }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#aa8d6f' }}></i>
                  Address:
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    minHeight: '120px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    resize: 'vertical',
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
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleSubmit}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(40,167,69,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.3)';
                }}
              >
                <i className="fas fa-save"></i>
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(108,117,125,0.3)',
                  display: 'flex',
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
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;