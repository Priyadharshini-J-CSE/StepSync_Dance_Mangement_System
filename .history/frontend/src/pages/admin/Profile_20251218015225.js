import React, { useState } from 'react';
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

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

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

  return (
    <div>
      <h2>Admin Profile</h2>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '2rem'
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
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Name:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>{user?.name}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Email:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>{user?.email}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Role:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {user?.role?.toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Status:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: user?.status === 'active' ? '#28a745' : '#ffc107',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {user?.status?.toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Phone:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Address:</label>
                <p style={{ margin: '0.25rem 0 0 0' }}>{user?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Edit Profile</h3>
            </div>
            
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