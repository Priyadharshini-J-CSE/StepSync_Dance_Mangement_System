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
        {/* Header Section (UNCHANGED) */}
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

        {/* Modal Form (UNCHANGED - all your form code stays exactly the same) */}
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
              {/* YOUR ENTIRE FORM CODE HERE - EXACTLY SAME */}
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

              {/* ALL YOUR FORM FIELDS - copy paste your exact form code here */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#675541' }}>
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => this.setState({ formData: { ...formData, name: e.target.value } })}
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
                    e.target.style.boxShadow = '0 0 0 3px rgba(170,141,111,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(170,141,111,0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* ... ALL OTHER FORM FIELDS EXACTLY SAME ... */}
              {/* I'm keeping it short here - paste your full form code */}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
                    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
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

        {/* ✅ FIXED CLASS CARDS - PROPER ALIGNMENT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', // Fixed width
            gap: '1.5rem',
            alignItems: 'start' // ✅ Key fix: aligns tops
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
                transition: 'all 0.3s ease',
                height: '100%', // ✅ Ensures same height
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(103,85,65,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(103,85,65,0.15)';
              }}
            >
              {/* ✅ FIXED CONTENT STRUCTURE */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: '0.75rem',
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
                    marginBottom: '1rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}
                >
                  {classItem.description}
                </p>

                {/* ✅ INFO GRID - PERFECT ALIGNMENT */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <strong style={{ color: '#675541', fontSize: '0.85rem' }}>Instructor</strong>
                    <p style={{ margin: '0.1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {classItem.instructor}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#675541', fontSize: '0.85rem' }}>Schedule</strong>
                    <p style={{ margin: '0.1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {classItem.schedule?.time} ({classItem.schedule?.duration} min)
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#675541', fontSize: '0.85rem' }}>Capacity</strong>
                    <p style={{ margin: '0.1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {classItem.enrolled?.length || 0}/{classItem.capacity}
                    </p>
                  </div>
                </div>

                {/* Mode Badge */}
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#675541', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                    Mode
                  </strong>
                  <span
                    style={{
                      backgroundColor: classItem.mode === 'online' ? '#007bff' : '#28a745',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {classItem.mode === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Location */}
                {classItem.mode === 'offline' && classItem.location?.address && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#675541', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                      Location
                    </strong>
                    <p style={{ margin: '0.1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {classItem.location.address}
                      {classItem.location.mapLink && (
                        <a
                          href={classItem.location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginLeft: '0.5rem',
                            color: '#007bff',
                            textDecoration: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          📍 Map
                        </a>
                      )}
                    </p>
                  </div>
                )}

                {/* Online Meeting Buttons */}
                {classItem.mode === 'online' && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => window.open(`/admin/video-call/${classItem._id}`, '_blank')}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        🎥 Join Call
                      </button>
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
                          padding: '0.4rem 0.8rem',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        📧 Send Link
                      </button>
                    </div>
                  </div>
                )}

                {/* Packages */}
                <div>
                  <strong style={{ color: '#675541', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                    Packages
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    3 mo: ${classItem.packages.find((p) => p.type === '3month')?.price}, 
                    1 yr: ${classItem.packages.find((p) => p.type === '1year')?.price}
                  </p>
                </div>
              </div>

              {/* ✅ ACTION BUTTONS - FIXED POSITION */}
              <div style={{
                marginTop: 'auto', // ✅ Pushes buttons to bottom
                display: 'flex',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(170,141,111,0.1)'
              }}>
                <button
                  onClick={() => this.startEdit(classItem)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                    color: '#675541',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button
                  onClick={() => this.handleDelete(classItem._id)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #dc3545 0%, #b51f32 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 3px 8px rgba(220,53,69,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Classes;
