import React from 'react';
import axios from 'axios';

class Attendance extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date().toISOString().split('T')[0];
    this.state = {
      classes: [],
      selectedClass: '',
      attendance: [],
      enrolledUsers: [],
      selectedDate: today
    };
  }

  componentDidMount() {
    this.fetchClasses();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedClass, selectedDate } = this.state;

    // When class changes, fetch both attendance and enrolled users
    if (selectedClass && selectedClass !== prevState.selectedClass) {
      this.fetchAttendance();
      this.fetchEnrolledUsers();
    }

    // When date changes (same class), refresh attendance (history card + badges)
    if (
      selectedClass &&
      selectedDate !== prevState.selectedDate &&
      selectedClass === prevState.selectedClass
    ) {
      this.fetchAttendance();
    }
  }

  fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      this.setState({ classes: response.data });
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  fetchAttendance = async () => {
    const { selectedClass } = this.state;
    if (!selectedClass) return;
    try {
      const response = await axios.get(`/api/attendance/class/${selectedClass}`);
      this.setState({ attendance: response.data });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  fetchEnrolledUsers = async () => {
    const { selectedClass } = this.state;
    if (!selectedClass) return;
    try {
      const response = await axios.get(`/api/classes/${selectedClass}/enrolled`);
      this.setState({ enrolledUsers: response.data });
    } catch (error) {
      console.error('Error fetching enrolled users:', error);
    }
  };

  markAttendance = async (userId, status) => {
    const { selectedClass, selectedDate } = this.state;
    try {
      await axios.post('/api/attendance', {
        userId,
        classId: selectedClass,
        date: selectedDate,
        status
      });
      this.fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  getAttendanceForUser = (userId) => {
    const { attendance, selectedDate } = this.state;
    return attendance.find(
      (a) =>
        a.user._id === userId &&
        new Date(a.date).toDateString() ===
          new Date(selectedDate).toDateString()
    );
  };

  render() {
    const {
      classes,
      selectedClass,
      attendance,
      enrolledUsers,
      selectedDate
    } = this.state;

    const selectedClassObj = classes.find((c) => c._id === selectedClass);

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 12px 28px rgba(170,141,111,0.3)',
            marginBottom: '3rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '2.4rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <i className="fas fa-clipboard-check"></i>
                Attendance Management
              </h1>
              <p
                style={{
                  marginTop: '0.8rem',
                  fontSize: '1.05rem',
                  opacity: 0.95,
                  maxWidth: '520px'
                }}
              >
                Track and manage student attendance for all your classes with a
                consistent, warm dashboard theme.
              </p>
            </div>

            <div
              style={{
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
                className="fas fa-calendar-day"
                style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}
              ></i>
              <div
                style={{
                  fontSize: '1rem',
                  marginBottom: '0.25rem',
                  opacity: 0.9
                }}
              >
                Selected Date
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                {new Date(selectedDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                Records: {attendance.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
            padding: '1.75rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            border: '1px solid rgba(170,141,111,0.2)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#675541'
              }}
            >
              <i
                className="fas fa-chalkboard-teacher"
                style={{ marginRight: '0.4rem', color: '#aa8d6f' }}
              ></i>
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) =>
                this.setState({ selectedClass: e.target.value })
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
              <option value="">Choose a class</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#675541'
              }}
            >
              <i
                className="fas fa-calendar"
                style={{ marginRight: '0.4rem', color: '#aa8d6f' }}
              ></i>
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                this.setState({ selectedDate: e.target.value })
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
            />
          </div>

          {selectedClassObj && (
            <div
              style={{
                minWidth: '220px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(170,141,111,0.3)'
              }}
            >
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#888',
                  marginBottom: '0.25rem'
                }}
              >
                Selected
              </div>
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: '#675541'
                }}
              >
                {selectedClassObj.name}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginTop: '0.25rem'
                }}
              >
                Capacity: {selectedClassObj.capacity} • Enrolled:{' '}
                {enrolledUsers.length}
              </div>
            </div>
          )}
        </div>

        {/* Table + history */}
        {selectedClass && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '1.5rem'
            }}
          >
            {/* Attendance table card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
                border: '1px solid rgba(170,141,111,0.2)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(170,141,111,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background:
                    'linear-gradient(135deg, #faf8f6 0%, #f0e6da 100%)'
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: '#675541',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-users"></i>
                  Mark Attendance
                </h3>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    backgroundColor: 'rgba(170,141,111,0.12)',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '999px'
                  }}
                >
                  {enrolledUsers.length} students
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.95rem'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f8f6f3' }}>
                      <th
                        style={{
                          padding: '0.9rem 1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(170,141,111,0.2)',
                          color: '#675541',
                          fontWeight: '600'
                        }}
                      >
                        Student
                      </th>
                      <th
                        style={{
                          padding: '0.9rem 1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(170,141,111,0.2)',
                          color: '#675541',
                          fontWeight: '600'
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: '0.9rem 1rem',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(170,141,111,0.2)',
                          color: '#675541',
                          fontWeight: '600'
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#888'
                          }}
                        >
                          No enrolled users found. Students must register for
                          this class and be accepted by admin first.
                        </td>
                      </tr>
                    ) : (
                      enrolledUsers.map((user) => {
                        const userAttendance =
                          this.getAttendanceForUser(user._id);
                        const status = userAttendance?.status;

                        const bgColor =
                          status === 'present'
                            ? '#d4edda'
                            : status === 'absent'
                            ? '#f8d7da'
                            : '#e2e3e5';
                        const color =
                          status === 'present'
                            ? '#155724'
                            : status === 'absent'
                            ? '#721c24'
                            : '#383d41';

                        return (
                          <tr key={user._id}>
                            <td
                              style={{
                                padding: '0.9rem 1rem',
                                borderBottom:
                                  '1px solid rgba(170,141,111,0.15)',
                                color: '#675541'
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: '600',
                                  marginBottom: '0.15rem'
                                }}
                              >
                                {user.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                {user.email}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: '0.9rem 1rem',
                                borderBottom:
                                  '1px solid rgba(170,141,111,0.15)'
                              }}
                            >
                              <span
                                style={{
                                  padding: '0.3rem 0.7rem',
                                  borderRadius: '999px',
                                  backgroundColor: bgColor,
                                  color,
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {status || 'Not marked'}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: '0.9rem 1rem',
                                borderBottom:
                                  '1px solid rgba(170,141,111,0.15)'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  flexWrap: 'wrap'
                                }}
                              >
                                <button
                                  onClick={() =>
                                    this.markAttendance(user._id, 'present')
                                  }
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.9rem',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    boxShadow:
                                      '0 3px 8px rgba(40,167,69,0.35)'
                                  }}
                                >
                                  <i className="fas fa-check"></i>
                                  Present
                                </button>
                                <button
                                  onClick={() =>
                                    this.markAttendance(user._id, 'absent')
                                  }
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #dc3545 0%, #b51f32 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.9rem',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    boxShadow:
                                      '0 3px 8px rgba(220,53,69,0.4)'
                                  }}
                                >
                                  <i className="fas fa-times"></i>
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance history card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
                border: '1px solid rgba(170,141,111,0.2)',
                padding: '1.5rem'
              }}
            >
              <h4
                style={{
                  marginTop: 0,
                  marginBottom: '1rem',
                  color: '#675541',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-history"></i>
                Attendance History
              </h4>

              <div
                style={{
                  maxHeight: '360px',
                  overflowY: 'auto',
                  paddingRight: '0.3rem'
                }}
              >
                {attendance.length === 0 ? (
                  <div
                    style={{
                      padding: '1.5rem',
                      textAlign: 'center',
                      color: '#888',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(170,141,111,0.4)'
                    }}
                  >
                    No attendance records for this class yet.
                  </div>
                ) : (
                  attendance.map((record) => (
                    <div
                      key={record._id}
                      style={{
                        padding: '0.75rem 1rem',
                        marginBottom: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid rgba(170,141,111,0.18)'
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: '#675541'
                          }}
                        >
                          {record.user?.name || 'Unknown User'}
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: '#888'
                          }}
                        >
                          {record.user?.email}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: '#666'
                        }}
                      >
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div
                        style={{
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          color:
                            record.status === 'present' ? '#28a745' : '#dc3545'
                        }}
                      >
                        {record.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Attendance;
