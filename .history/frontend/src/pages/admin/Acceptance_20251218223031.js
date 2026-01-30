import React from 'react';
import axios from 'axios';

class Acceptance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      loading: true,
      activeTab: 'pending'
    };
  }

  componentDidMount() {
    this.fetchRequests(this.state.activeTab);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.fetchRequests(this.state.activeTab);
    }
  }

  fetchRequests = async (status = 'pending') => {
    this.setState({ loading: true });
    try {
      const response = await axios.get(
        `/api/classes/requests?status=${status}`
      );
      this.setState({ requests: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching requests:', error);
      this.setState({ loading: false });
    }
  };

  handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/notifications/accept-request/${requestId}`);
      this.fetchRequests(this.state.activeTab);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  handleReject = async (requestId) => {
    if (
      window.confirm(
        'Are you sure you want to reject this request? Payment will be refunded.'
      )
    ) {
      try {
        await axios.post(`/api/notifications/reject-request/${requestId}`);
        this.fetchRequests(this.state.activeTab);
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  render() {
    const { requests, loading, activeTab } = this.state;

    if (loading) {
      return (
        <div
          style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#675541',
            fontSize: '1.1rem'
          }}
        >
          <i
            className="fas fa-spinner fa-spin"
            style={{ marginRight: '0.5rem' }}
          ></i>
          Loading requests...
        </div>
      );
    }

    const tabs = [
      { key: 'pending', label: 'Pending', icon: 'fas fa-hourglass-half' },
      { key: 'accepted', label: 'Accepted', icon: 'fas fa-check-circle' },
      { key: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle' }
    ];

    const getTabColor = (key) => {
      if (key === 'pending') return '#ffc107';
      if (key === 'accepted') return '#28a745';
      if (key === 'rejected') return '#dc3545';
      return '#aa8d6f';
    };

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
            marginBottom: '3rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(40px)'
            }}
          ></div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '2.4rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <i className="fas fa-clipboard-list"></i>
                Class Registration Requests
              </h1>
              <p
                style={{
                  marginTop: '0.8rem',
                  fontSize: '1.05rem',
                  opacity: 0.95,
                  maxWidth: '520px'
                }}
              >
                Review, accept, or reject class registration requests with a
                consistent, warm dashboard theme.
              </p>
            </div>

            <div
              style={{
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '1.75rem',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                minWidth: '220px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}
            >
              <i
                className="fas fa-envelope-open-text"
                style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}
              ></i>
              <div
                style={{
                  fontSize: '1rem',
                  marginBottom: '0.3rem',
                  opacity: 0.9
                }}
              >
                Current Tab
              </div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  marginBottom: '0.3rem',
                  textTransform: 'capitalize'
                }}
              >
                {activeTab}
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                Requests: {requests.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const color = getTabColor(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => this.setState({ activeTab: tab.key })}
                style={{
                  border: 'none',
                  padding: '0.7rem 1.4rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isActive
                    ? `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
                    : 'rgba(255,255,255,0.9)',
                  color: isActive ? 'white' : '#675541',
                  boxShadow: isActive
                    ? `0 4px 12px ${color}55`
                    : '0 2px 6px rgba(103,85,65,0.15)',
                  borderBottom: isActive
                    ? '2px solid rgba(255,255,255,0.7)'
                    : '1px solid rgba(170,141,111,0.3)'
                }}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {requests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
              borderRadius: '16px',
              marginTop: '1rem',
              boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
              border: '1px solid rgba(170,141,111,0.2)'
            }}
          >
            <i
              className="fas fa-inbox"
              style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}
            ></i>
            <h3
              style={{
                marginBottom: '0.5rem',
                color: '#675541',
                fontSize: '1.5rem'
              }}
            >
              No {activeTab} requests
            </h3>
            <p style={{ color: '#888', fontSize: '1rem' }}>
              No {activeTab} class registration requests found.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {requests.map((request) => (
              <div
                key={request._id}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
                  padding: '1.6rem',
                  borderRadius: '16px',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
                  border: '1px solid rgba(170,141,111,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <i
                      className="fas fa-user-circle"
                      style={{ fontSize: '1.6rem', color: '#aa8d6f' }}
                    ></i>
                    <h4
                      style={{
                        margin: 0,
                        color: '#675541',
                        fontSize: '1.2rem'
                      }}
                    >
                      {request.user?.name || 'Unknown User'}
                    </h4>
                  </div>

                  <p
                    style={{
                      color: '#666',
                      marginBottom: '0.25rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    <strong>Class:</strong> {request.class?.name || 'N/A'}
                  </p>
                  <p
                    style={{
                      color: '#666',
                      marginBottom: '0.25rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    <strong>Package:</strong>{' '}
                    {request.package === '3month' ? '3 Months' : '1 Year'}
                  </p>
                  <p
                    style={{
                      color: '#666',
                      marginBottom: '0.25rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    <strong>Request Date:</strong>{' '}
                    {new Date(
                      request.requestDate
                    ).toLocaleDateString()}
                  </p>

                  {request.user?.email && (
                    <p
                      style={{
                        color: '#888',
                        marginBottom: 0,
                        fontSize: '0.9rem'
                      }}
                    >
                      <i
                        className="fas fa-envelope"
                        style={{ marginRight: '0.4rem', color: '#aa8d6f' }}
                      ></i>
                      {request.user.email}
                    </p>
                  )}
                </div>

                {activeTab === 'pending' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      minWidth: '180px'
                    }}
                  >
                    <button
                      onClick={() => this.handleAccept(request._id)}
                      style={{
                        background:
                          'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(40,167,69,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <i className="fas fa-check"></i>
                      Accept
                    </button>
                    <button
                      onClick={() => this.handleReject(request._id)}
                      style={{
                        background:
                          'linear-gradient(135deg, #dc3545 0%, #b51f32 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(220,53,69,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <i className="fas fa-times"></i>
                      Reject
                    </button>
                  </div>
                )}

                {activeTab !== 'pending' && (
                  <div
                    style={{
                      minWidth: '120px',
                      textAlign: 'right',
                      fontSize: '0.9rem',
                      color:
                        activeTab === 'accepted'
                          ? '#28a745'
                          : '#dc3545',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  >
                    <i
                      className={
                        activeTab === 'accepted'
                          ? 'fas fa-check-circle'
                          : 'fas fa-times-circle'
                      }
                      style={{ marginRight: '0.4rem' }}
                    ></i>
                    {activeTab}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Acceptance;
