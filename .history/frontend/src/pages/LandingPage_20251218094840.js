import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('/api/feedback/public');
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundImage: 'url(/image.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        boxShadow: '0 4px 12px rgba(170, 141, 111, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        
      }}>
        <h1 style={{ margin: 0, color: '#aa8d6f' }}>DanceHub</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/user-login" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#aa8d6f',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(170, 141, 111, 0.3)'
          }}>
            Student Login
          </Link>
          <Link to="/admin-login" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#aa8d6f',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(170, 141, 111, 0.3)'
          }}>
            Admin Login
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '6rem 2rem',
        backgroundImage: 'url(/image1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        boxShadow: '0 8px 24px rgba(170, 141, 111, 0.2)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
        height:'700px',
        alignItems:'center',
        aligncontent:'center',
        justifyContent:'center',
        display:'flex',
        flexDirection:'column'
       
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to DanceHub</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem',fontWeight:'bold' }}>
          Your premier destination for dance classes and fitness programs
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', textShadow: 'none', fontWeight:'bold' }}>
        <Link to="/user-register" style={{
          padding: '1rem 2rem',
          backgroundColor: '#ffffff',
          color: '#aa8d6f',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          marginRight: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
          
        }}>
          Join as Student
        </Link>
        <Link to="/admin-register" style={{
          padding: '1rem 2rem',
          backgroundColor: '#ffeed3',
          color: '#aa8d6f',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
        }}>
          Become Instructor
        </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', backgroundImage: 'url(/image1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>Why Choose DanceHub?</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.67)',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
            textAlign: 'center',
           
          }}>
            <h3 style={{ color: '#aa8d6f', marginTop: 0 , fontSize:'1.5rem'}}>Professional Instructors</h3>
            <p style={{ color: '#2c2c2c' }}>Learn from certified dance professionals with years of experience</p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.78)',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
            textAlign: 'center',
         
          }}>
            <h3 style={{ color: '#aa8d6f', marginTop: 0 }}>Flexible Scheduling</h3>
            <p style={{ color: '#2c2c2c' }}>Choose from various time slots that fit your busy lifestyle</p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.67)',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
            textAlign: 'center',
          
          }}>
            <h3 style={{ color: '#aa8d6f', marginTop: 0 }}>Track Progress</h3>
            <p style={{ color: '#2c2c2c' }}>Monitor your attendance and improvement with our tracking system</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '4rem 2rem', backgroundImage: 'url(/image1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>Why our Student says?</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {feedback.length > 0 ? feedback.map(item => (
            <div key={item._id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                color: '#ffc107',
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                {renderStars(item.rating)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                "{item.comment}"
              </p>
              <div style={{ fontWeight: 'bold', color: '#aa8d6f' }}>- {item.user?.name}</div>
              {item.class && (
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  {item.class.name} Class
                </div>
              )}
            </div>
          )) : (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
              textAlign: 'center',
              gridColumn: '1 / -1',
              backdropFilter: 'blur(10px)'
            }}>
              <p>No feedback available yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 2rem', backgroundImage: 'url(/image1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>Get in Touch!</h1>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 6px 20px rgba(170, 141, 111, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'grid', gap: '1rem', color: '#2c2c2c' }}>
            <div>
              <strong style={{ color: '#aa8d6f' }}>Address:</strong> 123 Dance Street, City Center, State 12345
            </div>
            <div>
              <strong style={{ color: '#aa8d6f' }}>Phone:</strong> (555) 123-4567
            </div>
            <div>
              <strong style={{ color: '#aa8d6f' }}>Email:</strong> info@dancehub.com
            </div>
            <div>
              <strong style={{ color: '#aa8d6f' }}>Hours:</strong> Mon-Fri 9AM-9PM, Sat-Sun 10AM-6PM
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#aa8d6f',
        color: '#ffffff',
        textAlign: 'center',
        padding: '2rem',
        boxShadow: '0 -4px 12px rgba(170, 141, 111, 0.15)'
      }}>
        
        <p>&copy; 2024 DanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
