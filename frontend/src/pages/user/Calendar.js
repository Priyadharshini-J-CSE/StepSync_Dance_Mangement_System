import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('/api/attendance/user');
      setAttendance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAttendanceForDate = (date) => {
    return attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={day} style={{
          padding: '0.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6'
        }}>
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          padding: '0.5rem',
          border: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa'
        }}></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAttendance = getAttendanceForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} style={{
          padding: '0.5rem',
          border: '1px solid #dee2e6',
          minHeight: '80px',
          backgroundColor: isToday ? '#e3f2fd' : 'white',
          position: 'relative'
        }}>
          <div style={{ fontWeight: isToday ? 'bold' : 'normal' }}>
            {day}
          </div>
          {dayAttendance.map(record => (
            <div key={record._id} style={{
              fontSize: '0.7rem',
              padding: '0.1rem 0.3rem',
              margin: '0.1rem 0',
              borderRadius: '2px',
              backgroundColor: record.status === 'present' ? '#d4edda' : '#f8d7da',
              color: record.status === 'present' ? '#155724' : '#721c24'
            }}>
              {record.class?.name} - {record.status}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const getAttendanceStats = () => {
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(record => record.status === 'present').length;
    const attendanceRate = totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(1) : 0;

    return { totalClasses, presentClasses, attendanceRate };
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  const stats = getAttendanceStats();

  return (
    <div>
      <h2>Calendar & Attendance Tracker</h2>
      
      {/* Attendance Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Total Classes</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.totalClasses}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Classes Attended</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.presentClasses}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>Attendance Rate</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.attendanceRate}%
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Previous
          </button>
          
          <h3 style={{ margin: 0 }}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}>
          {renderCalendar()}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Legend:</h4>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '15px',
              backgroundColor: '#d4edda',
              borderRadius: '2px'
            }}></div>
            <span>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '15px',
              backgroundColor: '#f8d7da',
              borderRadius: '2px'
            }}></div>
            <span>Absent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '2px'
            }}></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;