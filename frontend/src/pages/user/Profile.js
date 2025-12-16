import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/auth/profile', formData);
      window.location.reload();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'inactive':
        return {
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          description: 'Your profile is inactive. Register for a class to activate it.'
        };
      case 'pending':
        return {
          color: '#856404',
          backgroundColor: '#fff3cd',
          description: 'Your class registration is pending admin approval.'
        };
      case 'active':
        return {
          color: '#155724',
          backgroundColor: '#d4edda',
          description: 'Your profile is active! You can attend classes.'
        };
      default:
        return {
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          description: 'Status unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(user?.status);

  return (
    <div>
      <h2>My Profile</h2>
      
      {/* Profile Status Card */}
      <div style={{
        backgroundColor: statusInfo.backgroundColor,
        color: statusInfo.color,
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: `1px solid ${statusInfo.color}33`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem' }}>
            {user?.status === 'active' ? '✅' : user?.status === 'pending' ? '⏳' : '⚪'}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
              Profile Status: {user?.status?.toUpperCase()}
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              {statusInfo.description}
            </p>
          </div>
        </div>
        
        {user?.status === 'inactive' && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            💡 <strong>Next Steps:</strong> Browse available classes and register for one to activate your profile.
          </div>
        )}
        
        {user?.status === 'pending' && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            ⏰ <strong>Please Wait:</strong> Admin will review your registration within 3 days. You'll receive a notification once approved.
          </div>
        )}
        
        {user?.status === 'active' && (
          <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            🎉 <strong>Welcome!</strong> You can now attend classes and track your progress in the Calendar section.
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
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Name:</label>
                <p style={{ margin: 0, padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user?.name}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Email:</label>
                <p style={{ margin: 0, padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user?.email}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Role:</label>
                <div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Phone:</label>
                <p style={{ margin: 0, padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {user?.phone || 'Not provided'}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'start' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Address:</label>
                <p style={{ margin: 0, padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', minHeight: '60px' }}>
                  {user?.address || 'Not provided'}
                </p>
              </div>

              {user?.membershipExpiry && (
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold', color: '#666' }}>Membership Expires:</label>
                  <p style={{ margin: 0, padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    {new Date(user.membershipExpiry).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Edit Profile</h3>
            </div>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
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