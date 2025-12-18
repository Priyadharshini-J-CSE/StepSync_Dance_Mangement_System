import React, { useState, useEffect } from 'react';

const Classes = () => {
  const [classes, setClasses] = useState([
    {
      _id: '1',
      name: 'Contemporary Dance',
      description: 'Modern dance techniques and expression',
      instructor: 'Sarah Martinez',
      schedule: { days: ['Mon', 'Wed', 'Fri'], time: '6:00 PM', duration: 60 },
      capacity: 20,
      mode: 'online',
      enrolled: [1, 2, 3, 4, 5],
      packages: [
        { type: '3month', price: 100 },
        { type: '1year', price: 350 }
      ]
    },
    {
      _id: '2',
      name: 'Hip Hop Basics',
      description: 'Learn fundamental hip hop moves',
      instructor: 'Mike Johnson',
      schedule: { days: ['Tue', 'Thu'], time: '7:00 PM', duration: 60 },
      capacity: 25,
      mode: 'offline',
      enrolled: [1, 2, 3],
      packages: [
        { type: '3month', price: 90 },
        { type: '1year', price: 320 }
      ]
    }
  ]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      setClasses(classes.map(c => c._id === editingClass._id ? { ...formData, _id: editingClass._id } : c));
    } else {
      setClasses([...classes, { ...formData, _id: Date.now().toString(), enrolled: [] }]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c._id !== id));
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
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
            Create and manage dance classes
          </p>
        </div>
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
            display: 'flex',
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
          <i className="fas fa-plus"></i>
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
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            width: '550px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(170,141,111,0.2)'
          }}>
            <h3 style={{
              margin: '0 0 2rem 0',
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#675541',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <i className={editingClass ? 'fas fa-edit' : 'fas fa-plus-circle'}></i>
              {editingClass ? 'Edit Class' : 'Create New Class'}
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>Class Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    minHeight: '80px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>Instructor:</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>Schedule Time:</label>
                <select
                  value={formData.schedule.time}
                  onChange={(e) => setFormData({
                    ...formData, 
                    schedule: {...formData.schedule, time: e.target.value}
                  })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}>Duration (min):</label>
                  <input
                    type="number"
                    value={formData.schedule.duration}
                    onChange={(e) => setFormData({
                      ...formData, 
                      schedule: {...formData.schedule, duration: parseInt(e.target.value)}
                    })}
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem',
                      border: '2px solid rgba(170,141,111,0.3)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}>Capacity:</label>
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
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem',
                      border: '2px solid rgba(170,141,111,0.3)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#675541'
                }}>Class Mode:</label>
                <select
                  value={formData.mode || 'offline'}
                  onChange={(e) => setFormData({...formData, mode: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="offline">Offline (In-person)</option>
                  <option value="online">Online (Video Call)</option>
                </select>
              </div>

              {formData.mode === 'online' && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  padding: '1rem', 
                  borderRadius: '10px',
                  border: '2px solid rgba(33,150,243,0.3)'
                }}>
                  <p style={{ margin: 0, color: '#1565c0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-video"></i>
                    Online Class
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Meeting link will be automatically generated when you create this class.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={handleSubmit}
                style={{
                  background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
                  flex: 1
                }}
              >
                {editingClass ? 'Update' : 'Create'}
              </button>
              <button 
                onClick={resetForm}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(108,117,125,0.3)',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {classes.map(classItem => (
          <div key={classItem._id} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(103,85,65,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(103,85,65,0.15)';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.6rem',
                  color: '#675541',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <i className="fas fa-music" style={{ color: '#aa8d6f' }}></i>
                  {classItem.name}
                </h3>
                <p style={{ color: '#666', margin: '0 0 1rem 0', lineHeight: '1.6' }}>
                  {classItem.description}
                </p>
                
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-user-tie" style={{ color: '#aa8d6f', minWidth: '20px' }}></i>
                    <strong>Instructor:</strong> {classItem.instructor}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-clock" style={{ color: '#aa8d6f', minWidth: '20px' }}></i>
                    <strong>Schedule:</strong> {classItem.schedule.time} ({classItem.schedule.duration} min)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-users" style={{ color: '#aa8d6f', minWidth: '20px' }}></i>
                    <strong>Capacity:</strong> {classItem.enrolled?.length || 0}/{classItem.capacity}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-tag" style={{ color: '#aa8d6f', minWidth: '20px' }}></i>
                    <strong>Packages:</strong> 3 months - ${classItem.packages.find(p => p.type === '3month')?.price}, 1 year - ${classItem.packages.find(p => p.type === '1year')?.price}
                  </div>
                </div>

                <span style={{ 
                  background: classItem.mode === 'online' 
                    ? 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
                    : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className={classItem.mode === 'online' ? 'fas fa-video' : 'fas fa-building'}></i>
                  {classItem.mode === 'online' ? 'Online' : 'Offline'}
                </span>

                {classItem.mode === 'online' && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => alert('Would open video call')}
                      style={{
                        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className="fas fa-video"></i>
                      Join Call
                    </button>
                    <button
                      onClick={() => alert('Meeting link sent to students!')}
                      style={{
                        background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className="fas fa-paper-plane"></i>
                      Send Link
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '2rem' }}>
                <button
                  onClick={() => startEdit(classItem)}
                  style={{
                    background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(220,53,69,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-trash"></i>
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