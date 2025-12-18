import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await axios.get(`/api/attendance/class/${selectedClass}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }, [selectedClass]);

  const fetchEnrolledUsers = useCallback(async () => {
    try {
      const response = await axios.get(`/api/classes/${selectedClass}/enrolled`);
      console.log('Enrolled users:', response.data);
      setEnrolledUsers(response.data);
    } catch (error) {
      console.error('Error fetching enrolled users:', error);
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
      fetchEnrolledUsers();
    }
  }, [selectedClass, selectedDate, fetchAttendance, fetchEnrolledUsers]);

  const markAttendance = async (userId, status) => {
    try {
      await axios.post('/api/attendance', {
        userId,
        classId: selectedClass,
        date: selectedDate,
        status
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const getAttendanceForUser = (userId) => {
    return attendance.find(a => 
      a.user._id === userId && 
      new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
    );
  };

  return (
    <div>
      <h2>Attendance Management</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          >
            <option value="">Choose a class</option>
            {classes.map(classItem => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          />
        </div>
      </div>

      {selectedClass && (
        <div>
          <h3>Mark Attendance for {classes.find(c => c._id === selectedClass)?.name}</h3>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Student Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrolledUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      No enrolled users found. Users need to register for this class and be accepted by admin first.
                    </td>
                  </tr>
                ) : enrolledUsers.map(user => {
                  const userAttendance = getAttendanceForUser(user._id);
                  return (
                    <tr key={user._id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                        {user.name} ({user.email})
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: userAttendance?.status === 'present' ? '#d4edda' : 
                                         userAttendance?.status === 'absent' ? '#f8d7da' : '#e2e3e5',
                          color: userAttendance?.status === 'present' ? '#155724' : 
                                userAttendance?.status === 'absent' ? '#721c24' : '#383d41'
                        }}>
                          {userAttendance?.status || 'Not marked'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => markAttendance(user._id, 'present')}
                            style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(user._id, 'absent')}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4>Attendance History</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {attendance.map(record => (
                <div key={record._id} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{record.user?.name || 'Unknown User'}</span>
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span style={{
                    color: record.status === 'present' ? 'green' : 'red'
                  }}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;