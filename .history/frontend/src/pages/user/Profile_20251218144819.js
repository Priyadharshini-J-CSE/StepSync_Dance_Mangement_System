import React from 'react';
import axios from 'axios';

class Classes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      showForm: false,
      editingClass: null,
      formData: {
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
      }
    };
  }

  componentDidMount() {
    this.fetchClasses();
  }

  fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      this.setState({ classes: response.data });
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { editingClass, formData } = this.state;
    try {
      if (editingClass) {
        await axios.put(`/api/classes/${editingClass._id}`, formData);
      } else {
        await axios.post('/api/classes', formData);
      }
      this.fetchClasses();
      this.resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/classes/${id}`);
        this.fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
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
      },
      editingClass: null,
      showForm: false
    });
  };

  startEdit = (classItem) => {
    // Ensure schedule exists to avoid undefined errors
    this.setState({
      formData: {
        ...classItem,
        schedule: classItem.schedule || { days: [], time: '', duration: 60 }
      },
      editingClass: classItem,
      showForm: true
    });
  };

  render() {
    const { classes, showForm, editingClass, formData } = this.state;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <h2>Class Management</h2>
          <button
            onClick={() => this.setState({ showForm: true })}
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
          <div
            style={{
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
            }}
          >
            <form
              onSubmit={this.handleSubmit}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '500px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <h3>{editingClass ? 'Edit Class' : 'Create New Class'}</h3>

              <div style={{ marginBottom: '1rem' }}>
                <label>Class Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, name: e.target.value }
                    })
                  }
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, description: e.target.value }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '0.25rem',
                    minHeight: '80px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Instructor:</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, instructor: e.target.value }
                    })
                  }
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Schedule Time:</label>
                <select
                  value={formData.schedule.time}
                  onChange={(e) =>
                    this.setState({
                      formData: {
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          time: e.target.value
                        }
                      }
                    })
                  }
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
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

              <div style={{ marginBottom: '1rem' }}>
                <label>Duration (minutes):</label>
                <input
                  type="number"
                  value={formData.schedule.duration}
                  onChange={(e) =>
                    this.setState({
                      formData: {
                        ...formData,
                        schedule: {
                          ...formData.schedule,
                          duration: parseInt(e.target.value, 10)
                        }
                      }
                    })
                  }
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Capacity:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value > 50) {
                      alert('Maximum capacity is 50 students');
                      this.setState({
                        formData: { ...formData, capacity: 50 }
                      });
                    } else {
                      this.setState({
                        formData: { ...formData, capacity: value }
                      });
                    }
                  }}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Maximum: 50 students
                </small>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Class Mode:</label>
                <select
                  value={formData.mode || 'offline'}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, mode: e.target.value }
                    })
                  }
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="offline">Offline (In-person)</option>
                  <option value="online">Online (Video Call)</option>
                </select>
              </div>

              {formData.mode === 'online' && (
                <div
                  style={{
                    backgroundColor: '#e7f3ff',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    border: '1px solid #007bff'
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#007bff',
                      fontWeight: 'bold'
                    }}
                  >
                    📹 Online Class
                  </p>
                  <p
                    style={{
                      margin: '0.5rem 0 0 0',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}
                  >
                    Meeting link will be automatically generated when you create this
                    class.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem'
                }}
              >
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {editingClass ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={this.resetForm}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}
              >
                <div>
                  <h3>{classItem.name}</h3>
                  <p
                    style={{ color: '#666', margin: '0.5rem 0' }}
                  >
                    {classItem.description}
                  </p>
                  <p>
                    <strong>Instructor:</strong> {classItem.instructor}
                  </p>
                  <p>
                    <strong>Schedule:</strong>{' '}
                    {classItem.schedule?.time} ({classItem.schedule?.duration} min)
                  </p>
                  <p>
                    <strong>Mode:</strong>{' '}
                    <span
                      style={{
                        backgroundColor:
                          classItem.mode === 'online' ? '#007bff' : '#28a745',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {classItem.mode === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </p>
                  <p>
                    <strong>Capacity:</strong>{' '}
                    {classItem.enrolled?.length || 0}/{classItem.capacity}
                  </p>
                  {classItem.mode === 'online' && (
                    <div>
                      <p>
                        <strong>Meeting:</strong>
                        <button
                          onClick={() =>
                            window.open(
                              `/admin/video-call/${classItem._id}`,
                              '_blank'
                            )
                          }
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
                            const response = await axios.post(
                              `/api/meeting-links/send-meeting-link/${classItem._id}`
                            );
                            alert(response.data.message);
                          } catch (error) {
                            alert(
                              error.response?.data?.message ||
                                'Failed to send meeting link'
                            );
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
                  <p>
                    <strong>Packages:</strong> 3 months - $
                    {classItem.packages.find((p) => p.type === '3month')?.price},
                    {' '}1 year - $
                    {classItem.packages.find((p) => p.type === '1year')?.price}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => this.startEdit(classItem)}
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
                    onClick={() => this.handleDelete(classItem._id)}
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
  }
}

export default Classes;
