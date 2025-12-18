import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/passwordValidation';
import Alert from '../components/Alert';

const AdminRegister = () => {
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
      await register({ ...formData, role: 'admin' });
      navigate('/admin');
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
      backgroundImage: 'url(/image9.png)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundAttachment: 'fixed',
      backgroundPosition: 'bottom 30% right 1350px', 
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#28a745' }}>
          Instructor Registration
        </h2>
        
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              borderRadius: '4px'
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
              borderRadius: '4px'
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
              borderRadius: '4px'
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
              borderRadius: '4px'
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
              minHeight: '80px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
              required
            />
            I accept the Terms and Conditions and Privacy Policy
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#28a745',
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
          <p>Already have an account? <Link to="/admin-login">Login here</Link></p>
          <p><Link to="/">Back to Home</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminRegister;