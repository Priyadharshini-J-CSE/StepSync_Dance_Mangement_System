import React, { useState, useEffect } from 'react';

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
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingClass ? `/api/classes/${editingClass._id}` : '/api/classes';
      const method = editingClass ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      fetchClasses();
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await fetch(`/api/classes/${id}`, { method: 'DELETE' });
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

  const sendMeetingLink = async (classId) => {
    try {
      const response = await fetch(`/api/meeting-links/send-meeting-link/${classId}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Failed to send meeting link');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid rgba(170,141,111,0.3)',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#675541'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
        padding: '2rem 2.5rem',
        borderRadius: '20px',
        boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
        color: 'white'
      }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: '700' }}>
            Class Management
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
            Manage your dance classes and schedules
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 6px 16px rgba(40,167,69,0.4)'
        }}>
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
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}>
          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '20px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 2rem 0', fontSize: '2rem', color: '#675541', fontWeight: '700' }}>
              {editingClass ? 'Edit Class' : 'Create New Class'}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Class Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g., Contemporary Dance" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe your class..." style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Instructor</label>
              <input type="text" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} placeholder="Instructor name" style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Time</label>
                <select value={formData.schedule.time} onChange={(e) => setFormData({ ...formData, schedule: {...formData.schedule, time: e.target.value} })} required style={{ ...inputStyle, cursor: 'pointer', backgroundColor: 'white' }}>
                  <option value="">Select Time</option>
                  <optgroup label="Morning">
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                  </optgroup>
                  <optgroup label="Evening">
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Duration (min)</label>
                <input type="number" value={formData.schedule.duration} onChange={(e) => setFormData({ ...formData, schedule: {...formData.schedule, duration: parseInt(e.target.value)} })} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Capacity</label>
                <input type="number" min="1" max="50" value={formData.capacity} onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 50) {
                    alert('Maximum capacity is 50 students');
                    setFormData({...formData, capacity: 50});
                  } else {
                    setFormData({...formData, capacity: value});
                  }
                }} required style={inputStyle} />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>Max: 50 students</small>
              </div>

              <div>
                <label style={labelStyle}>Class Mode</label>
                <select value={formData.mode || 'offline'} onChange={(e) => setFormData({...formData, mode: e.target.value})} style={{ ...inputStyle, cursor: 'pointer', backgroundColor: 'white' }}>
                  <option value="offline">🏢 Offline (In-person)</option>
                  <option value="online">💻 Online (Video Call)</option>
                </select>
              </div>
            </div>

            {formData.mode === 'online' && (
              <div style={{ background: 'linear-gradient(135deg, #e7f3ff 0%, #cfe7ff 100%)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #007bff' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#007bff', fontWeight: '700', fontSize: '1.1rem' }}>Online Class</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#0056b3' }}>Meeting link will be automatically generated when you create this class.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" style={{
                flex: 1,
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {editingClass ? 'Update Class' : 'Create Class'}
              </button>
              <button type="button" onClick={resetForm} style={{
                flex: 1,
                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {classes.map(classItem => (
          <div key={classItem._id} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#675541', fontWeight: '700' }}>
                  {classItem.name}
                </h3>
                <span style={{ 
                  backgroundColor: classItem.mode === 'online' ? '#007bff' : '#28a745',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {classItem.mode === 'online' ? '💻 Online' : '🏢 Offline'}
                </span>
              </div>
              <p style={{ color: '#666', margin: '0 0 1.5rem 0' }}>{classItem.description}</p>

              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <p><strong>Instructor:</strong> {classItem.instructor}</p>
                <p><strong>Schedule:</strong> {classItem.schedule.time} ({classItem.schedule.duration} min)</p>
                <p><strong>Capacity:</strong> {classItem.enrolled?.length || 0}/{classItem.capacity}</p>
                <p><strong>Packages:</strong> 3 months - ${classItem.packages.find(p => p.type === '3month')?.price}, 1 year - ${classItem.packages.find(p => p.type === '1year')?.price}</p>
              </div>

              {classItem.mode === 'online' && (
                <div style={{ padding: '1.25rem', backgroundColor: 'rgba(0,123,255,0.08)', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid rgba(0,123,255,0.2)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => window.open(`/admin/video-call/${classItem._id}`, '_blank')} style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}>
                      Join Call
                    </button>
                    <button onClick={() => sendMeetingLink(classItem._id)} style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}>
                      Send Link
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => startEdit(classItem)} style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(classItem._id)} style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '20px',
          border: '2px dashed rgba(170,141,111,0.3)'
        }}>
          <h3 style={{ color: '#675541', marginBottom: '0.5rem' }}>No Classes Yet</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start by creating your first dance class</p>
          <button onClick={() => setShowForm(true)} style={{
            background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            Create Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default Classes;