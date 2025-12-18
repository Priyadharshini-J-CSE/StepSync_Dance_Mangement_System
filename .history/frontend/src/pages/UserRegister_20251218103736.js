import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/passwordValidation';
import Alert from '../components/Alert';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    acceptTerms: false
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (password) => {
    setFormData({...formData, password});
    setPasswordValidation(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (!passwordValidation?.isValid) {
      setAlert({ message: 'Password does not meet requirements', type: 'error' });
      return;
    }

    if (!formData.acceptTerms) {
      setAlert({ message: 'Please accept terms and conditions', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await register({ ...formData, role: 'user' });
      navigate('/user');
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Registration failed', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '1rem',
      backgroundImage: 'url(/image.png)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'right', 
      backgroundAttachment: 'fixed'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor:'#ffffff72' ,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#007bff' }}>
          Student Registration
        </h2>
        
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', }}>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
               backgroundColor:'#ffffff72' ,
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
               backgroundColor:'#ffffff72'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
               backgroundColor:'#ffffff72'
            }}
          />
          {passwordValidation && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ 
                color: passwordValidation.strength === 'Strong' ? 'green' : 
                       passwordValidation.strength === 'Medium' ? 'orange' : 'red'
              }}>
                Strength: {passwordValidation.strength}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
               backgroundColor:'#ffffff72'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
               backgroundColor:'#ffffff72'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address:</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '80px',
               backgroundColor:'#ffffff72'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              color: '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            View Terms & Conditions and Privacy Policy
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
              required
              disabled={!hasScrolled}
            />
            I accept the Terms and Conditions and Privacy Policy
            {!hasScrolled && <span style={{ color: 'red', fontSize: '0.8rem' }}>(Read first)</span>}
          </label>
        </div>

        {showTerms && (
          <div className="modal-overlay" onClick={() => setShowTerms(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <h3 style={{ marginTop: 0 }}>Terms & Conditions and Privacy Policy</h3>
              <div
                onScroll={(e) => {
                  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
                  if (bottom) setHasScrolled(true);
                }}
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <h4>Terms and Conditions</h4>
                <p>Welcome to DanceHub. By registering, you agree to the following terms:</p>
                <ol>
                  <li>You must provide accurate and complete information during registration.</li>
                  <li>You are responsible for maintaining the confidentiality of your account.</li>
                  <li>You must be at least 18 years old to register.</li>
                  <li>Payment for classes must be made in advance.</li>
                  <li>Refunds are subject to our refund policy.</li>
                  <li>You agree to attend classes on time and follow instructor guidelines.</li>
                  <li>We reserve the right to cancel classes due to unforeseen circumstances.</li>
                  <li>You agree not to share class materials without permission.</li>
                </ol>

                <h4>Privacy Policy</h4>
                <p>We value your privacy and are committed to protecting your personal information:</p>
                <ol>
                  <li>We collect personal information including name, email, phone, and address.</li>
                  <li>Your information is used solely for class management and communication.</li>
                  <li>We do not sell or share your personal information with third parties.</li>
                  <li>Payment information is processed securely through encrypted channels.</li>
                  <li>You have the right to access, modify, or delete your personal data.</li>
                  <li>We use cookies to improve your experience on our platform.</li>
                  <li>Your attendance and payment records are stored securely.</li>
                  <li>We may send you notifications about classes and updates.</li>
                </ol>

                <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>
                  Please scroll to the bottom to enable the acceptance checkbox.
                </p>
              </div>
              <button
                onClick={() => setShowTerms(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>Already have an account? <Link to="/user-login">Login here</Link></p>
          <p><Link to="/">Back to Home</Link></p>
        </div>
      </form>
    </div>
  );
};

export default UserRegister;