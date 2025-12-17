import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../components/Alert';

const Payment = () => {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageType = searchParams.get('package');
  
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const fetchClassData = useCallback(async () => {
    try {
      const response = await axios.get('/api/classes');
      const selectedClass = response.data.find(c => c._id === classId);
      setClassData(selectedClass);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  const getPackageDetails = () => {
    if (!classData) return null;
    const pkg = classData.packages.find(p => p.type === packageType);
    return {
      ...pkg,
      name: pkg.type === '3month' ? '3 Month Package' : '1 Year Package',
      duration: pkg.type === '3month' ? '3 months' : '1 year'
    };
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const packageDetails = getPackageDetails();
      await axios.post('/api/payments', {
        classId,
        amount: packageDetails.price,
        package: packageType,
        paymentMethod: paymentData.paymentMethod
      });

      // Show receipt
      setAlert({ message: 'Payment successful! Receipt generated.', type: 'success' });
      
      // Navigate to payment history or show receipt
      setTimeout(() => navigate('/user/payment-history'), 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setAlert({ message: 'Payment failed. Please try again.', type: 'error' });
    }
    setProcessing(false);
  };

  if (loading) {
    return <div>Loading payment details...</div>;
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  const packageDetails = getPackageDetails();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Payment</h2>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Order Summary */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span><strong>Class:</strong></span>
            <span>{classData.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span><strong>Package:</strong></span>
            <span>{packageDetails.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span><strong>Duration:</strong></span>
            <span>{packageDetails.duration}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span><strong>Instructor:</strong></span>
            <span>{classData.instructor}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span><strong>Schedule:</strong></span>
            <span>{classData.schedule.time}</span>
          </div>
        </div>
        
        <hr style={{ margin: '1rem 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span>Total Amount:</span>
          <span style={{ color: '#28a745' }}>${packageDetails.price}</span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePayment} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Payment Details</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Payment Method:
          </label>
          <select
            value={paymentData.paymentMethod}
            onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {(paymentData.paymentMethod === 'credit_card' || paymentData.paymentMethod === 'debit_card') && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Cardholder Name:
              </label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Card Number:
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Expiry Date:
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  CVV:
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          </>
        )}

        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px', 
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#1976d2'
        }}>
          🔒 Your payment information is secure and encrypted. After successful payment, you will receive a receipt and your registration will be pending admin approval.
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={processing}
            style={{
              flex: 1,
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '4px',
              cursor: processing ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {processing ? 'Processing...' : `Pay $${packageDetails.price}`}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/user')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;