import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Acceptance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/classes/requests');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/notifications/accept-request/${requestId}`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request? Payment will be refunded.')) {
      try {
        await axios.post(`/api/notifications/reject-request/${requestId}`);
        fetchRequests(); // Refresh the list
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Class Registration Requests</h2>
      
      {requests.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No pending requests</h3>
          <p>All class registration requests have been processed.</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {requests.map(request => (
            <div key={request._id} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>
                    {request.user?.name || 'Unknown User'}
                  </h4>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Email:</strong> {request.user?.email}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Class:</strong> {request.class?.name}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Package:</strong> {request.package === '3month' ? '3 Months' : '1 Year'}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Auto-reject Date:</strong> {new Date(request.autoRejectDate).toLocaleDateString()}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: request.status === 'pending' ? '#fff3cd' : 
                                   request.status === 'accepted' ? '#d4edda' : 
                                   request.status === 'inactive' ? '#e2e3e5' : '#f8d7da',
                    color: request.status === 'pending' ? '#856404' : 
                           request.status === 'accepted' ? '#155724' : 
                           request.status === 'inactive' ? '#383d41' : '#721c24',
                    marginTop: '0.5rem'
                  }}>
                    Class Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button
                      onClick={() => handleAccept(request._id)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
              
              {new Date(request.autoRejectDate) <= new Date() && request.status === 'pending' && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  ⚠️ This request has expired and will be automatically rejected with payment refund.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Acceptance;