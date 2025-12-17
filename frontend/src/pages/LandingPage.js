import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>DanceHub</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/user-login" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Student Login
          </Link>
          <Link to="/admin-login" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to DanceHub</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Your premier destination for dance classes and fitness programs
        </p>
        <Link to="/user-register" style={{
          padding: '1rem 2rem',
          backgroundColor: '#ff6b6b',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          marginRight: '1rem'
        }}>
          Join as Student
        </Link>
        <Link to="/admin-register" style={{
          padding: '1rem 2rem',
          backgroundColor: '#4ecdc4',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem'
        }}>
          Become Instructor
        </Link>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose DanceHub?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💃</div>
            <h3>Professional Instructors</h3>
            <p>Learn from certified dance professionals with years of experience</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3>Flexible Scheduling</h3>
            <p>Choose from various time slots that fit your busy lifestyle</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3>Track Progress</h3>
            <p>Monitor your attendance and improvement with our tracking system</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>What Our Students Say</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              "Amazing instructors and great atmosphere. I've improved so much in just 3 months!"
            </p>
            <div style={{ fontWeight: 'bold' }}>- Sarah Johnson</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
              "The scheduling system is so convenient. I can easily book classes around my work."
            </p>
            <div style={{ fontWeight: 'bold' }}>- Mike Chen</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Get In Touch</h2>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>📍 Address:</strong> 123 Dance Street, City Center, State 12345
            </div>
            <div>
              <strong>📞 Phone:</strong> (555) 123-4567
            </div>
            <div>
              <strong>✉️ Email:</strong> info@dancehub.com
            </div>
            <div>
              <strong>🕒 Hours:</strong> Mon-Fri 9AM-9PM, Sat-Sun 10AM-6PM
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <p>&copy; 2024 DanceHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;