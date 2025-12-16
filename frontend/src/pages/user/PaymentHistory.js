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
    // In a real app, this would generate and download a PDF
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

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div>
      <h2>Payment History</h2>
      
      {payments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>No payment history</h3>
          <p>You haven't made any payments yet.</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Receipt #
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Class
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Package
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Amount
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment._id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      {payment.receiptNumber}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      {payment.class?.name || 'Unknown Class'}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      {payment.package === '3month' ? '3 Months' : '1 Year'}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      ${payment.amount}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(payment.status),
                        color: 'white',
                        fontSize: '0.8rem'
                      }}>
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => viewReceipt(payment._id)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => downloadReceipt(payment)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
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
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3>ZUMBA CLASS MANAGEMENT SYSTEM</h3>
              <h4>Payment Receipt</h4>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Receipt Number:</strong> {selectedReceipt.receiptNumber}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date:</strong> {new Date(selectedReceipt.createdAt).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Class:</strong> {selectedReceipt.class?.name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Package:</strong> {selectedReceipt.package === '3month' ? '3 Month' : '1 Year'} Package
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Amount:</strong> ${selectedReceipt.amount}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Payment Method:</strong> {selectedReceipt.paymentMethod}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Transaction ID:</strong> {selectedReceipt.transactionId}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Valid From:</strong> {new Date(selectedReceipt.validFrom).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <strong>Valid Until:</strong> {new Date(selectedReceipt.validUntil).toLocaleDateString()}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem', fontStyle: 'italic' }}>
              Thank you for your payment!
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => downloadReceipt(selectedReceipt)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;