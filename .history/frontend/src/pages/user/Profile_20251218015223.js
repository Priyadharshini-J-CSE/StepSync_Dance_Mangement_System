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
      <span key={i} style={{ color: i < stars ? '#ffd700' : '#ddd', fontSize: '1.5rem' }}>
        ★
      </span>
    ));
  };

  const getRankColor = (rank, total) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return '#ffd700'; // Gold
    if (percentage <= 25) return '#c0c0c0'; // Silver
    if (percentage <= 50) return '#cd7f32'; // Bronze
    return '#666';
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Header Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{user?.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div>{renderStars(profileStats?.starRating || 1)}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {profileStats?.skillPoints || 0} Points
              </div>
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Global Rank: #{profileStats?.globalRank || 'N/A'} of {profileStats?.totalUsers || 0}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
              {profileStats?.completedCourses || 0}
            </div>
            <div>Courses Completed</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
            {profileStats?.totalAttendance || 0}
          </div>
          <div style={{ color: '#666' }}>Total Classes</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {profileStats?.presentAttendance || 0}
          </div>
          <div style={{ color: '#666' }}>Classes Attended</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            {profileStats?.consistencyRate || 0}%
          </div>
          <div style={{ color: '#666' }}>Consistency</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: getRankColor(profileStats?.globalRank, profileStats?.totalUsers)
          }}>
            #{profileStats?.globalRank || 'N/A'}
          </div>
          <div style={{ color: '#666' }}>Global Rank</div>
        </div>
      </div>

      {/* Badges Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Achievements & Badges</h3>
        {profileStats?.badges?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {profileStats.badges.map((badge, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: badge.color,
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
                {badge.name}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            Complete courses to earn badges!
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Dance Skills</h3>
        {profileStats?.skills && Object.keys(profileStats.skills).length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(profileStats.skills).map(([danceType, skill]) => (
              <div key={danceType} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{danceType}</h4>
                    <div style={{ color: '#666' }}>
                      {skill.courses} courses completed • {skill.level}
                    </div>
                  </div>
                  <div>{renderStars(skill.stars)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            Complete courses to develop your dance skills!
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Profile Information</h3>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><strong>Name:</strong> {user?.name}</div>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Phone:</strong> {user?.phone || 'Not provided'}</div>
              <div><strong>Address:</strong> {user?.address || 'Not provided'}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '2rem' }}>Edit Profile</h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Address:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minHeight: '100px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;