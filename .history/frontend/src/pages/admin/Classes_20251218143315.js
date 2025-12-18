import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, onClose }) => (
  <div style={{
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    borderRadius: '12px',
    backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
    color: type === 'success' ? '#155724' : '#721c24',
    border: `2px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
      <i className={type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
      {message}
    </span>
    <button onClick={onClose} style={{ 
      background: 'none', 
      border: 'none', 
      fontSize: '1.5rem', 
      cursor: 'pointer',
      color: 'inherit',
      padding: '0 0.5rem'
    }}>×</button>
  </div>
);

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [alert, setAlert] = useState(null);
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
      setAlert({ message: 'Failed to fetch classes', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingClass ? `/api/classes/${editingClass._id}` : '/api/classes';
      const method = editingClass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchClasses();
        resetForm();
        setAlert({ 
          message: editingClass ? 'Class updated successfully!' : 'Class created successfully!', 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error('Error saving class:', error);
      setAlert({ message: 'Failed to save class', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchClasses();
          setAlert({ message: 'Class deleted successfully!', type: 'success' });
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        setAlert({ message: 'Failed to delete class', type: 'error' });
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
      setAlert({ message: data.message || 'Meeting link sent successfully!', type: 'success' });
    } catch (error) {
      setAlert({ message: 'Failed to send meeting link', type: 'error' });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
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
    marginBottom: '0.75rem',
    fontWeight: '600',
    color: '#675541'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#675541',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <i className="fas fa-chalkboard-teacher"></i>
          Class Management
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', margin: 0 }}>
          Manage your dance classes and schedules
        </p>
      </div>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* Create Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
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
          <i className="fas fa-plus-circle"></i>
          Create New Class
        </button>
      </div>

      {/* Modal Form */}
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
            borderRadius: '16px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              margin: '0 0 2rem 0', 
              fontSize: '1.8rem', 
              color: '#675541', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <i className={editingClass ? 'fas fa-edit' : 'fas fa-plus-circle'} style={{ color: '#aa8d6f' }}></i>
              {editingClass ? 'Edit Class' : 'Create New Class'}
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                <i className="fas fa-graduation-cap" style={{ color: '#aa8d6f' }}></i>
                Class Name
              </label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                placeholder="e.g., Contemporary Dance" 
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#aa8d6f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                <i className="fas fa-align-left" style={{ color: '#aa8d6f' }}></i>
                Description
              </label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Describe your class..." 
                style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit', resize: 'vertical' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#aa8d6f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                <i className="fas fa-user-tie" style={{ color: '#aa8d6f' }}></i>
                Instructor
              </label>
              <input 
                type="text" 
                value={formData.instructor} 
                onChange={(e) => setFormData({...formData, instructor: e.target.value})} 
                placeholder="Instructor name" 
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#aa8d6f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <i className="fas fa-clock" style={{ color: '#aa8d6f' }}></i>
                  Time
                </label>
                <select 
                  value={formData.schedule.time} 
                  onChange={(e) => setFormData({ ...formData, schedule: {...formData.schedule, time: e.target.value} })} 
                  required 
                  style={{ ...inputStyle, cursor: 'pointer', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
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
                <label style={labelStyle}>
                  <i className="fas fa-hourglass-half" style={{ color: '#aa8d6f' }}></i>
                  Duration (min)
                </label>
                <input 
                  type="number" 
                  value={formData.schedule.duration} 
                  onChange={(e) => setFormData({ ...formData, schedule: {...formData.schedule, duration: parseInt(e.target.value)} })} 
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <i className="fas fa-users" style={{ color: '#aa8d6f' }}></i>
                  Capacity
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={formData.capacity} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 50) {
                      alert('Maximum capacity is 50 students');
                      setFormData({...formData, capacity: 50});
                    } else {
                      setFormData({...formData, capacity: value});
                    }
                  }} 
                  required 
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>Max: 50 students</small>
              </div>

              <div>
                <label style={labelStyle}>
                  <i className="fas fa-location-arrow" style={{ color: '#aa8d6f' }}></i>
                  Class Mode
                </label>
                <select 
                  value={formData.mode || 'offline'} 
                  onChange={(e) => setFormData({...formData, mode: e.target.value})} 
                  style={{ ...inputStyle, cursor: 'pointer', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="offline">🏢 Offline (In-person)</option>
                  <option value="online">💻 Online (Video Call)</option>
                </select>
              </div>
            </div>

            {formData.mode === 'online' && (
              <div style={{ 
                background: 'linear-gradient(135deg, #e7f3ff 0%, #cfe7ff 100%)', 
                padding: '1.25rem', 
                borderRadius: '12px', 
                marginBottom: '1.5rem', 
                border: '2px solid #007bff' 
              }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#007bff', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-video"></i>
                  Online Class
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#0056b3' }}>
                  Meeting link will be automatically generated when you create this class.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" style={{
                flex: 1,
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,123,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
              }}>
                <i className={editingClass ? 'fas fa-save' : 'fas fa-plus'}></i>
                {editingClass ? 'Update Class' : 'Create Class'}
              </button>
              <button type="button" onClick={resetForm} style={{
                flex: 1,
                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(108,117,125,0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(108,117,125,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(108,117,125,0.3)';
              }}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {classes.map(classItem => (
          <div key={classItem._id} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(103,85,65,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(103,85,65,0.15)';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
                <p style={{ color: '#666', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>{classItem.description}</p>

                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fas fa-user-tie" style={{ color: '#aa8d6f', fontSize: '1.1rem', minWidth: '20px' }}></i>
                    <span style={{ fontWeight: '600', color: '#675541' }}>Instructor:</span>
                    <span style={{ color: '#666' }}>{classItem.instructor}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fas fa-clock" style={{ color: '#aa8d6f', fontSize: '1.1rem', minWidth: '20px' }}></i>
                    <span style={{ fontWeight: '600', color: '#675541' }}>Schedule:</span>
                    <span style={{ color: '#666' }}>{classItem.schedule.time} ({classItem.schedule.duration} min)</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fas fa-users" style={{ color: '#aa8d6f', fontSize: '1.1rem', minWidth: '20px' }}></i>
                    <span style={{ fontWeight: '600', color: '#675541' }}>Capacity:</span>
                    <span style={{ color: '#666' }}>{classItem.enrolled?.length || 0}/{classItem.capacity}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fas fa-dollar-sign" style={{ color: '#aa8d6f', fontSize: '1.1rem', minWidth: '20px' }}></i>
                    <span style={{ fontWeight: '600', color: '#675541' }}>Packages:</span>
                    <span style={{ color: '#666' }}>
                      3 months - ${classItem.packages.find(p => p.type === '3month')?.price}, 
                      1 year - ${classItem.packages.find(p => p.type === '1year')?.price}
                    </span>
                  </div>
                </div>

                {classItem.mode === 'online' && (
                  <div style={{ 
                    padding: '1.25rem', 
                    backgroundColor: 'rgba(0,123,255,0.08)', 
                    borderRadius: '12px', 
                    marginBottom: '1.5rem', 
                    border: '2px solid rgba(0,123,255,0.2)' 
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => window.open(`/admin/video-call/${classItem._id}`, '_blank')} 
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="fas fa-video"></i>
                        Join Call
                      </button>
                      <button 
                        onClick={() => sendMeetingLink(classItem._id)} 
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(23,162,184,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i className="fas fa-paper-plane"></i>
                        Send Link
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => startEdit(classItem)} 
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '0.875rem 1rem',