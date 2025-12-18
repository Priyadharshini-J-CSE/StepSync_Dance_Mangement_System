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
          padding: '1rem 0.5rem',
          fontWeight: '700',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
          color: 'white',
          border: '1px solid rgba(170,141,111,0.3)',
          fontSize: '0.9rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
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
          border: '1px solid rgba(170,141,111,0.2)',
          backgroundColor: 'rgba(248,246,243,0.3)'
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
          padding: '0.75rem',
          border: '1px solid rgba(170,141,111,0.2)',
          minHeight: '100px',
          backgroundColor: isToday ? 'rgba(170,141,111,0.15)' : 'rgba(255,255,255,0.9)',
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          if (!isToday) {
            e.currentTarget.style.backgroundColor = 'rgba(170,141,111,0.08)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isToday) {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}>
          <div style={{ 
            fontWeight: isToday ? '700' : '600',
            color: isToday ? '#aa8d6f' : '#675541',
            fontSize: isToday ? '1.1rem' : '1rem',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            {isToday && <i className="fas fa-calendar-day" style={{ fontSize: '0.9rem' }}></i>}
            {day}
          </div>
          {dayAttendance.map(record => (
            <div key={record._id} style={{
              fontSize: '0.75rem',
              padding: '0.4rem 0.5rem',
              margin: '0.3rem 0',
              borderRadius: '6px',
              backgroundColor: record.status === 'present' ? '#d4edda' : '#f8d7da',
              color: record.status === 'present' ? '#155724' : '#721c24',
              fontWeight: '600',
              boxShadow: record.status === 'present' 
                ? '0 2px 6px rgba(40,167,69,0.2)' 
                : '0 2px 6px rgba(220,53,69,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: `1px solid ${record.status === 'present' ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              <i className={record.status === 'present' ? 'fas fa-check-circle' : 'fas fa-times-circle'} 
                 style={{ fontSize: '0.7rem' }}></i>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {record.class?.name}
              </span>
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
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#675541'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Loading calendar...
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ 
        color: '#675541', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(103,85,65,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <i className="fas fa-calendar-alt"></i>
        Calendar & Attendance Tracker
      </h2>
      
      {/* Attendance Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {[
          { title: 'Total Classes', value: stats.totalClasses, icon: 'fas fa-book', color: '#007bff' },
          { title: 'Classes Attended', value: stats.presentClasses, icon: 'fas fa-check-circle', color: '#28a745' },
          { title: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: 'fas fa-chart-pie', color: '#aa8d6f' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(103,85,65,0.15)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(170,141,111,0.2)',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(103,85,65,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(103,85,65,0.15)';
          }}>
            <i className={stat.icon} style={{ 
              fontSize: '3rem', 
              marginBottom: '0.75rem',
              color: stat.color
            }}></i>
            <h3 style={{ 
              margin: '0 0 0.75rem 0', 
              color: '#675541',
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {stat.title}
            </h3>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: stat.color,
              textShadow: `2px 2px 4px ${stat.color}20`
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        overflow: 'hidden',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, #f8f6f3 0%, #f0ede8 100%)',
          borderBottom: '2px solid rgba(170,141,111,0.2)'
        }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-3px)';
              e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
            }}
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          
          <h3 style={{ 
            margin: 0,
            color: '#675541',
            fontSize: '1.8rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-calendar-week" style={{ color: '#aa8d6f' }}></i>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            style={{
              background: 'linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(170,141,111,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(3px)';
              e.target.style.boxShadow = '0 6px 16px rgba(170,141,111,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(170,141,111,0.3)';
            }}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: 'rgba(255,255,255,0.5)'
        }}>
          {renderCalendar()}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #faf8f6 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(103,85,65,0.15)',
        border: '1px solid rgba(170,141,111,0.2)'
      }}>
        <h4 style={{ 
          margin: '0 0 1.5rem 0',
          color: '#675541',
          fontSize: '1.3rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-info-circle" style={{ color: '#aa8d6f' }}></i>
          Legend:
        </h4>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(212,237,218,0.3)',
            borderRadius: '10px',
            border: '2px solid #c3e6cb'
          }}>
            <div style={{
              width: '30px',
              height: '25px',
              backgroundColor: '#d4edda',
              borderRadius: '6px',
              border: '2px solid #c3e6cb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-check" style={{ color: '#155724', fontSize: '0.9rem' }}></i>
            </div>
            <span style={{ fontWeight: '600', color: '#155724' }}>Present</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(248,215,218,0.3)',
            borderRadius: '10px',
            border: '2px solid #f5c6cb'
          }}>
            <div style={{
              width: '30px',
              height: '25px',
              backgroundColor: '#f8d7da',
              borderRadius: '6px',
              border: '2px solid #f5c6cb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-times" style={{ color: '#721c24', fontSize: '0.9rem' }}></i>
            </div>
            <span style={{ fontWeight: '600', color: '#721c24' }}>Absent</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(170,141,111,0.1)',
            borderRadius: '10px',
            border: '2px solid rgba(170,141,111,0.3)'
          }}>
            <div style={{
              width: '30px',
              height: '25px',
              backgroundColor: 'rgba(170,141,111,0.15)',
              borderRadius: '6px',
              border: '2px solid rgba(170,141,111,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-calendar-day" style={{ color: '#aa8d6f', fontSize: '0.9rem' }}></i>
            </div>
            <span style={{ fontWeight: '600', color: '#675541' }}>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;