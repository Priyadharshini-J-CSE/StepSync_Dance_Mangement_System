import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ links }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Proper resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navStyle = {
    backgroundColor: '#343a40',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  const linkStyle = (link) => ({
    color: location.pathname === link.path ? '#ffc107' : 'white',
    textDecoration: 'none',
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem)',
    borderRadius: '8px',
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    backgroundColor: location.pathname === link.path ? '#495057' : 'transparent',
    border: location.pathname === link.path ? '1px solid #ffc107' : 'none',
    display: isMobile ? 'none' : 'inline-flex'  // ✅ Hides on mobile
  });

  return (
    <nav style={navStyle}>
      {/* Desktop Links - HIDDEN ON MOBILE */}
      <div style={{
        display: isMobile ? 'none' : 'flex',  // ✅ Completely hidden on mobile
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={linkStyle(link)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = location.pathname === link.path 
                ? '#495057' : 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = location.pathname === link.path 
                ? '#495057' : 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Hamburger - VISIBLE ONLY ON MOBILE */}
      <button
        style={{
          display: isMobile ? 'flex' : 'none',  // ✅ Shows only on mobile
          flexDirection: 'column',
          gap: '0.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          zIndex: 1001
        }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: isMenuOpen 
                ? (i === 1 ? 'rotate(45deg) translate(5px, 5px)' : 
                   i === 2 ? 'rotate(-45deg) translate(7px, -6px)' : 
                   'scale(0)') 
                : 'none'
            }}
          />
        ))}
      </button>

      {/* User Section - ALWAYS VISIBLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        <span 
          style={{ 
            color: 'white',
            fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} 
          title={user?.name}
        >
          👋 {user?.name || 'User'}
        </span>
        
        <button
          onClick={logout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            fontWeight: '600',
            minWidth: 'clamp(80px, 15vw, 100px)',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(220,53,69,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#c82333';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc3545';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(220,53,69,0.3)';
          }}
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && isMobile && (  // ✅ Only shows on mobile when open
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: 'clamp(250px, 80vw, 350px)',
          backgroundColor: 'rgba(52,58,64,0.98)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          gap: '0.75rem',
          zIndex: 1000,
          marginTop: '0.5rem',
          flexDirection: 'column',
          display: 'flex'
        }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: location.pathname === link.path ? '#ffc107' : 'white',
                textDecoration: 'none',
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderLeft: location.pathname === link.path ? '3px solid #ffc107' : 'none',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
