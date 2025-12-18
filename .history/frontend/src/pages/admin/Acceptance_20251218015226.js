import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Acceptance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const fetchRequests = async (status = 'pending') => {
    try {
      const response = await axios.get(`/api/classes/requests?status=${status}`);
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
      fetchRequests(activeTab);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request? Payment will be refunded.')) {
      try {
        await axios.post(`/api/notifications/reject-request/${requestId}`);
        fetchRequests(activeTab);
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
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            backgroundColor: activeTab === 'pending' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'pending' ? 'white' : '#333',
            border: '1px solid #ddd',
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          style={{
            backgroundColor: activeTab === 'accepted' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'accepted' ? 'white' : '#333',
            border: '1px solid #ddd',
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Accepted
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          style={{
            backgroundColor: activeTab === 'rejected' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'rejected' ? 'white' : '#333',
            border: '1px solid #ddd',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          Rejected
        </button>
      </div>
      
      {requests.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No {activeTab} requests</h3>
          <p>No {activeTab} class registration requests found.</p>
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
                    <strong>Class:</strong> {request.class?.name}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Package:</strong> {request.package === '3month' ? '3 Months' : '1 Year'}
                  </p>
                  <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                    <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
                
                {activeTab === 'pending' && (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Acceptance;