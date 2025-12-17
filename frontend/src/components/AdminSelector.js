import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert';

const AdminSelector = ({ user, onAdminAssigned }) => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/auth/admins');
      setAdmins(response.data);
    } catch (error) {
      setAlert({ message: 'Failed to load admins', type: 'error' });
    }
  };

  const handleAssign = async () => {
    if (!selectedAdmin) {
      setAlert({ message: 'Please select an admin', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await axios.put('/api/auth/assign-admin', { adminId: selectedAdmin });
      setAlert({ message: 'Admin assigned successfully! Please refresh the page.', type: 'success' });
      if (onAdminAssigned) onAdminAssigned();
    } catch (error) {
      setAlert({ message: 'Failed to assign admin', type: 'error' });
    }
    setLoading(false);
  };

  if (user?.adminId) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <h3 style={{ margin: '0 0 1rem 0', color: '#856404' }}>Select Your Admin</h3>
      <p style={{ margin: '0 0 1rem 0', color: '#856404' }}>
        You need to select an admin to access classes and features.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            flex: 1
          }}
        >
          <option value="">Choose an admin...</option>
          {admins.map(admin => (
            <option key={admin._id} value={admin._id}>
              {admin.name} ({admin.email})
            </option>
          ))}
        </select>
        
        <button
          onClick={handleAssign}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Assigning...' : 'Assign'}
        </button>
      </div>
    </div>
  );
};

export default AdminSelector;