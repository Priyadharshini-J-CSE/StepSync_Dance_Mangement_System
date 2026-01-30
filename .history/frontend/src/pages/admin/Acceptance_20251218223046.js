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
      const response = await axios.get(`/api/classes/requests?status=${status}`);
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
    if (window.confirm('Are you sure you want to reject this request? Payment will be refunded.')) {
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
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
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
      <div className="acceptance-container">
        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-left">
              <h1 className="header-title">
                <i className="fas fa-clipboard-list"></i>
                Class Registration Requests
              </h1>
              <p className="header-subtitle">
                Review, accept, or reject class registration requests with a consistent, warm dashboard theme.
              </p>
            </div>
            <div className="header-stats">
              <i className="fas fa-envelope-open-text"></i>
              <div className="stats-content">
                <div className="stats-label">Current Tab</div>
                <div className="stats-tab">{activeTab}</div>
                <div className="stats-count">Requests: {requests.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const color = getTabColor(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => this.setState({ activeTab: tab.key })}
                className={`tab-button ${isActive ? 'active' : ''}`}
                style={{ '--tab-color': color }}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {requests.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No {activeTab} requests</h3>
            <p>No {activeTab} class registration requests found.</p>
          </div>
        ) : (
          <div className="requests-container">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-content">
                  <div className="request-header">
                    <i className="fas fa-user-circle"></i>
                    <h4>{request.user?.name || 'Unknown User'}</h4>
                  </div>
                  
                  <div className="request-details">
                    <div className="detail-item">
                      <strong>Class:</strong> {request.class?.name || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Package:</strong>{' '}
                      {request.package === '3month' ? '3 Months' : '1 Year'}
                    </div>
                    <div className="detail-item">
                      <strong>Request Date:</strong>{' '}
                      {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                    
                    {request.user?.email && (
                      <div className="detail-item email">
                        <i className="fas fa-envelope"></i>
                        {request.user.email}
                      </div>
                    )}
                  </div>
                </div>

                {activeTab === 'pending' ? (
                  <div className="action-buttons">
                    <button
                      onClick={() => this.handleAccept(request._id)}
                      className="btn-accept"
                    >
                      <i className="fas fa-check"></i>
                      Accept
                    </button>
                    <button
                      onClick={() => this.handleReject(request._id)}
                      className="btn-reject"
                    >
                      <i className="fas fa-times"></i>
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className={`status-badge status-${activeTab}`}>
                    <i
                      className={activeTab === 'accepted' ? 'fas fa-check-circle' : 'fas fa-times-circle'}
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
