import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('/api/payments/history');
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setLoading(false);
    }
  };

  const viewReceipt = async (paymentId) => {
    try {
      const response = await axios.get(`/api/payments/receipt/${paymentId}`);
      setSelectedReceipt(response.data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  const downloadReceipt = (payment) => {
    const receiptContent = `
ZUMBA CLASS MANAGEMENT SYSTEM
Receipt #${payment.receiptNumber}

Date: ${new Date(payment.createdAt).toLocaleDateString()}
Class: ${payment.class?.name}
Package: ${payment.package === '3month' ? '3 Month' : '1 Year'} Package
Amount: $${payment.amount}
Payment Method: ${payment.paymentMethod}
Transaction ID: ${payment.transactionId}
Valid From: ${new Date(payment.validFrom).toLocaleDateString()}
Valid Until: ${new Date(payment.validUntil).toLocaleDateString()}

Thank you for your payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.receiptNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'refunded':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'refunded':
        return 'fas fa-undo';
      default:
        return 'fas fa-info-circle';
    }
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
        Loading payment history...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ 
        color: '#675541', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(103,85,65,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <i className="fas fa-history"></i>
        Payment History
      </h2>
      
      {payments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
          borderRadius: '16px',
          marginTop: '2rem',
          boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
          border: '1px solid rgba(170,141,111,0.2)'
        }}>
          <i className="fas fa-receipt" style={{ fontSize: '4rem', color: '#aa8d6f', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#675541', marginBottom: '0.5rem' }}>No payment history</h3>
          <p style={{ color: '#888' }}>You haven't made any payments yet.</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                    color: 'white'
                  }}>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-file-invoice" style={{ marginRight: '0.5rem' }}></i>
                      Receipt #
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-music" style={{ marginRight: '0.5rem' }}></i>
                      Class
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-box" style={{ marginRight: '0.5rem' }}></i>
                      Package
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-dollar-sign" style={{ marginRight: '0.5rem' }}></i>
                      Amount
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-calendar" style={{ marginRight: '0.5rem' }}></i>
                      Date
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                      Status
                    </th>
                    <th style={{ 
                      padding: '1.25rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <i className="fas fa-cogs" style={{ marginRight: '0.5rem' }}></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr 
                      key={payment._id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(248,246,243,0.5)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.1)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(248,246,243,0.5)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)',
                        color: '#675541',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}>
                        {payment.receiptNumber}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)',
                        color: '#666'
                      }}>
                        {payment.class?.name || 'Unknown Class'}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)',
                        color: '#666'
                      }}>
                        {payment.package === '3month' ? '3 Months' : '1 Year'}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)',
                        color: '#aa8d6f',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        ${payment.amount}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)',
                        color: '#666'
                      }}>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)'
                      }}>
                        <span style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          backgroundColor: getStatusColor(payment.status),
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: `0 2px 8px ${getStatusColor(payment.status)}40`
                        }}>
                          <i className={getStatusIcon(payment.status)}></i>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1rem', 
                        borderBottom: '1px solid rgba(170,141,111,0.2)'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => viewReceipt(payment._id)}
                            style={{
                              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.3)';
                            }}
                          >
                            <i className="fas fa-eye"></i>
                            View
                          </button>
                          <button
                            onClick={() => downloadReceipt(payment)}
                            style={{
                              background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: '0 2px 8px rgba(40,167,69,0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = '0 2px 8px rgba(40,167,69,0.3)';
                            }}
                          >
                            <i className="fas fa-download"></i>
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '3rem',
            borderRadius: '20px',
            width: '550px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '2px solid rgba(170,141,111,0.3)',
            animation: 'slideIn 0.3s ease'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2.5rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 8px 16px rgba(170,141,111,0.3)'
            }}>
              <i className="fas fa-receipt" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>ZUMBA CLASS MANAGEMENT</h3>
              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '400' }}>Payment Receipt</h4>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid rgba(170,141,111,0.2)'
            }}>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-hashtag" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Receipt Number:</strong> 
                <span style={{ color: '#666' }}>{selectedReceipt.receiptNumber}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-calendar-day" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Date:</strong> 
                <span style={{ color: '#666' }}>{new Date(selectedReceipt.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-music" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Class:</strong> 
                <span style={{ color: '#666' }}>{selectedReceipt.class?.name}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-box" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Package:</strong> 
                <span style={{ color: '#666' }}>{selectedReceipt.package === '3month' ? '3 Month' : '1 Year'} Package</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-dollar-sign" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Amount:</strong> 
                <span style={{ color: '#aa8d6f', fontSize: '1.3rem', fontWeight: '700' }}>${selectedReceipt.amount}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-credit-card" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Payment Method:</strong> 
                <span style={{ color: '#666' }}>{selectedReceipt.paymentMethod}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-barcode" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Transaction ID:</strong> 
                <span style={{ color: '#666', fontSize: '0.9rem', wordBreak: 'break-all' }}>{selectedReceipt.transactionId}</span>
              </div>
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-calendar-check" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Valid From:</strong> 
                <span style={{ color: '#666' }}>{new Date(selectedReceipt.validFrom).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-calendar-times" style={{ color: '#aa8d6f', width: '20px' }}></i>
                <strong style={{ color: '#675541', minWidth: '140px' }}>Valid Until:</strong> 
                <span style={{ color: '#666' }}>{new Date(selectedReceipt.validUntil).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem', 
              fontStyle: 'italic',
              color: '#aa8d6f',
              fontSize: '1.1rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(170,141,111,0.1)',
              borderRadius: '10px',
              border: '2px dashed rgba(170,141,111,0.3)'
            }}>
              <i className="fas fa-heart" style={{ marginRight: '0.5rem' }}></i>
              Thank you for your payment!
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => downloadReceipt(selectedReceipt)}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(40,167,69,0.3)'
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
                <i className="fas fa-download"></i>
                Download Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(108,117,125,0.3)'
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentHistory;