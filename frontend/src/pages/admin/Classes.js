import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    schedule: { days: [], time: '', duration: 60 },
    capacity: 20,
    mode: 'offline',
    packages: [
      { type: '3month', price: 100 },
      { type: '1year', price: 350 }
    ]
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await axios.put(`/api/classes/${editingClass._id}`, formData);
      } else {
        await axios.post('/api/classes', formData);
      }
      fetchClasses();
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/classes/${id}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      instructor: '',
      schedule: { days: [], time: '', duration: 60 },
      capacity: 20,
      mode: 'offline',
      packages: [
        { type: '3month', price: 100 },
        { type: '1year', price: 350 }
      ]
    });
    setEditingClass(null);
    setShowForm(false);
  };

  const startEdit = (classItem) => {
    setFormData(classItem);
    setEditingClass(classItem);
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Class Management</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Class
        </button>
      </div>

      {showForm && (
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
          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>{editingClass ? 'Edit Class' : 'Create New Class'}</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Class Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Instructor:</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Schedule Time:</label>
              <input
                type="text"
                placeholder="e.g., 10:00 AM"
                value={formData.schedule.time}
                onChange={(e) => setFormData({
                  ...formData, 
                  schedule: {...formData.schedule, time: e.target.value}
                })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={formData.schedule.duration}
                onChange={(e) => setFormData({
                  ...formData, 
                  schedule: {...formData.schedule, duration: parseInt(e.target.value)}
                })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Capacity:</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Class Mode:</label>
              <select
                value={formData.mode || 'offline'}
                onChange={(e) => setFormData({...formData, mode: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="offline">Offline (In-person)</option>
                <option value="online">Online (Video Call)</option>
              </select>
            </div>

            {formData.mode === 'online' && (
              <div style={{ 
                backgroundColor: '#e7f3ff', 
                padding: '1rem', 
                borderRadius: '4px', 
                marginBottom: '1rem',
                border: '1px solid #007bff'
              }}>
                <p style={{ margin: 0, color: '#007bff', fontWeight: 'bold' }}>📹 Online Class</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                  Meeting link will be automatically generated when you create this class.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                {editingClass ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {classes.map(classItem => (
          <div key={classItem._id} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>{classItem.name}</h3>
                <p style={{ color: '#666', margin: '0.5rem 0' }}>{classItem.description}</p>
                <p><strong>Instructor:</strong> {classItem.instructor}</p>
                <p><strong>Schedule:</strong> {classItem.schedule.time} ({classItem.schedule.duration} min)</p>
                <p><strong>Mode:</strong> <span style={{ 
                  backgroundColor: classItem.mode === 'online' ? '#007bff' : '#28a745',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>{classItem.mode === 'online' ? 'Online' : 'Offline'}</span></p>
                <p><strong>Capacity:</strong> {classItem.enrolled?.length || 0}/{classItem.capacity}</p>
                {classItem.mode === 'online' && (
                  <div>
                    <p><strong>Meeting:</strong> 
                      <button
                        onClick={() => window.open(`/admin/video-call/${classItem._id}`, '_blank')}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginLeft: '0.5rem'
                        }}
                      >
                        🎥 Join Call
                      </button>
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.post(`/api/meeting-links/send-meeting-link/${classItem._id}`);
                          alert(response.data.message);
                        } catch (error) {
                          alert(error.response?.data?.message || 'Failed to send meeting link');
                        }
                      }}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        marginTop: '0.5rem'
                      }}
                    >
                      📧 Send Link to Students
                    </button>
                  </div>
                )}
                <p><strong>Packages:</strong> 3 months - ${classItem.packages.find(p => p.type === '3month')?.price}, 1 year - ${classItem.packages.find(p => p.type === '1year')?.price}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => startEdit(classItem)}
                  style={{
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;