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
        location: { address: '', mapLink: '' },
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
        location: { address: '', mapLink: '' },
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header Section (same vibe as Profile header) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
            marginBottom: '3rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(40px)'
            }}
          ></div>

          <div style={{ position: 'relative' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '2.4rem',
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              Class Management
            </h1>
            <p
              style={{
                marginTop: '0.75rem',
                fontSize: '1.05rem',
                opacity: 0.95,
                maxWidth: '480px'
              }}
            >
              Create, manage, and schedule your dance classes with a beautiful
              dashboard that matches your profile theme.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '1.75rem',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              minWidth: '220px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            <i
              className="fas fa-calendar-alt"
              style={{ fontSize: '2.3rem', marginBottom: '0.75rem' }}
            ></i>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}
            >
              {classes.length}
            </div>
            <div style={{ fontSize: '1.05rem' }}>Active Classes</div>
            <button
              onClick={() => this.setState({ showForm: true })}
              style={{
                marginTop: '1rem',
                background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                color: '#675541',
                border: 'none',
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fas fa-plus"></i>
              New Class
            </button>
          </div>
        </div>

        {/* Modal Form with theme */}
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
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
                padding: '2.5rem',
                borderRadius: '20px',
                width: '520px',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 12px 28px rgba(103,85,65,0.25)',
                border: '1px solid rgba(170,141,111,0.25)'
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: '1.5rem',
                  color: '#675541',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <i className="fas fa-chalkboard"></i>
                {editingClass ? 'Edit Class' : 'Create New Class'}
              </h3>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, name: e.target.value }
                    })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, description: e.target.value }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    minHeight: '90px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Instructor
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, instructor: e.target.value }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Schedule Time
                </label>
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
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
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

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={formData.schedule.duration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value > 180) {
                      alert('Maximum duration is 180 minutes');
                      this.setState({
                        formData: {
                          ...formData,
                          schedule: {
                            ...formData.schedule,
                            duration: 180
                          }
                        }
                      });
                    } else {
                      this.setState({
                        formData: {
                          ...formData,
                          schedule: {
                            ...formData.schedule,
                            duration: value
                          }
                        }
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Capacity
                </label>
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
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#aa8d6f';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <small
                  style={{
                    color: '#888',
                    fontSize: '0.85rem',
                    display: 'block',
                    marginTop: '0.25rem'
                  }}
                >
                  Maximum: 50 students
                </small>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <small
                  style={{
                    color: '#888',
                    fontSize: '0.85rem',
                    display: 'block',
                    marginTop: '-1rem'
                  }}
                >
                  Maximum: 180 minutes
                </small>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    color: '#675541'
                  }}
                >
                  Class Mode
                </label>
                <select
                  value={formData.mode || 'offline'}
                  onChange={(e) =>
                    this.setState({
                      formData: { ...formData, mode: e.target.value }
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid rgba(170,141,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
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
                    borderRadius: '10px',
                    marginBottom: '1.2rem',
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
                    Meeting link will be automatically generated when you create
                    this class.
                  </p>
                </div>
              )}

              {formData.mode === 'offline' && (
                <div>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontWeight: '600',
                        color: '#675541'
                      }}
                    >
                      Location Address
                    </label>
                    <input
                      type="text"
                      value={formData.location?.address || ''}
                      onChange={(e) =>
                        this.setState({
                          formData: {
                            ...formData,
                            location: {
                              ...formData.location,
                              address: e.target.value
                            }
                          }
                        })
                      }
                      required
                      placeholder="Enter class location address"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '2px solid rgba(170,141,111,0.3)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.2rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontWeight: '600',
                        color: '#675541'
                      }}
                    >
                      Map Link
                    </label>
                    <input
                      type="url"
                      value={formData.location?.mapLink || ''}
                      onChange={(e) =>
                        this.setState({
                          formData: {
                            ...formData,
                            location: {
                              ...formData.location,
                              mapLink: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="Enter Google Maps link"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: '2px solid rgba(170,141,111,0.3)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
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
                    background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.9rem 1.8rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-save"></i>
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
                <button
                  type="button"
                  onClick={this.resetForm}
                  style={{
                    background:
                      'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.9rem 1.8rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(108,117,125,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Class cards grid with theme */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
                padding: '1.8rem',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
                border: '1px solid rgba(170,141,111,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 24px rgba(103,85,65,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 16px rgba(103,85,65,0.15)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: '0.5rem',
                      color: '#675541',
                      fontSize: '1.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-music" style={{ color: '#aa8d6f' }}></i>
                    {classItem.name}
                  </h3>
                  <p
                    style={{
                      color: '#666',
                      margin: '0.4rem 0 0.8rem 0',
                      fontSize: '0.95rem'
                    }}
                  >
                    {classItem.description}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#675541' }}>
                    <strong>Instructor:</strong> {classItem.instructor}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#675541' }}>
                    <strong>Schedule:</strong>{' '}
                    {classItem.schedule?.time} ({classItem.schedule?.duration} min)
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#675541' }}>
                    <strong>Mode:</strong>{' '}
                    <span
                      style={{
                        backgroundColor:
                          classItem.mode === 'online' ? '#007bff' : '#28a745',
                        color: 'white',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {classItem.mode === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#675541' }}>
                    <strong>Capacity:</strong>{' '}
                    {classItem.enrolled?.length || 0}/{classItem.capacity}
                  </p>
                  {classItem.mode === 'offline' && classItem.location?.address && (
                    <p style={{ margin: '0.25rem 0', color: '#675541' }}>
                      <strong>Location:</strong> {classItem.location.address}
                      {classItem.location.mapLink && (
                        <a
                          href={classItem.location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginLeft: '0.5rem',
                            color: '#007bff',
                            textDecoration: 'none'
                          }}
                        >
                          📍 View Map
                        </a>
                      )}
                    </p>
                  )}

                  {classItem.mode === 'online' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p
                        style={{
                          margin: 0,
                          color: '#675541',
                          fontSize: '0.95rem'
                        }}
                      >
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
                            padding: '0.3rem 0.7rem',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginLeft: '0.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
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
                          padding: '0.3rem 0.7rem',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginTop: '0.4rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        📧 Send Link to Students
                      </button>
                    </div>
                  )}

                  <p
                    style={{
                      marginTop: '0.7rem',
                      marginBottom: 0,
                      color: '#675541',
                      fontSize: '0.95rem'
                    }}
                  >
                    <strong>Packages:</strong>{' '}
                    3 months - $
                    {
                      classItem.packages.find((p) => p.type === '3month')
                        ?.price
                    }
                    , 1 year - $
                    {
                      classItem.packages.find((p) => p.type === '1year')
                        ?.price
                    }
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <button
                    onClick={() => this.startEdit(classItem)}
                    style={{
                      background:
                        'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                      color: '#675541',
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => this.handleDelete(classItem._id)}
                    style={{
                      background:
                        'linear-gradient(135deg, #dc3545 0%, #b51f32 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      boxShadow: '0 3px 8px rgba(220,53,69,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
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
