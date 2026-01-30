import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ links }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getResponsiveStyles = () => ({
    nav: {
      backgroundColor: '#343a40',
      padding: 'clamp(0.75rem, 3vw, 1rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    logoLinks: {
      display: 'flex',
      gap: 'clamp(0.5rem, 2vw, 1rem)',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: { base: 'center', md: 'flex-start' }
    },
    link: {
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
      '&:hover': {
        backgroundColor: location.pathname === link.path ? '#495057' : 'rgba(255,255,255,0.1)',
        transform: 'translateY(-1px)'
      }
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(0.75rem, 2vw, 1rem)',
      flexWrap: 'wrap',
      justifyContent: { base: 'center', md: 'flex-end' }
    },
    welcomeText: {
      color: 'white',
      fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      maxWidth: { base: '120px', md: '200px' },
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    logoutBtn: {
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
      boxShadow: '0 2px 8px rgba(220,53,69,0.3)',
      '&:hover': {
        backgroundColor: '#c82333',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(220,53,69,0.4)'
      }
    },
    hamburger: {
      display: { base: 'flex', lg: 'none' },
      flexDirection: 'column',
      gap: '0.25rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem'
    },
    hamburgerLine: {
      width: '24px',
      height: '2px',
      backgroundColor: 'white',
      borderRadius: '2px',
      transition: 'all 0.2s ease'
    },
    mobileMenu: {
      display: { base: 'flex', lg: 'none' },
      flexDirection: 'column',
      backgroundColor: 'rgba(52,58,64,0.98)',
      backdropFilter: 'blur(10px)',
      position: 'absolute',
      top: '100%',
      right: 0,
      width: 'clamp(250px, 80vw, 350px)',
      padding: '1.5rem',
      borderRadius: '0 0 12px 12px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      gap: '0.75rem',
      zIndex: 1000
    }
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav style={getResponsiveStyles().nav}>
      {/* Logo/Links - Desktop */}
      <div style={getResponsiveStyles().logoLinks}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...getResponsiveStyles().link,
              display: { base: 'none', lg: 'inline-flex' }
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = location.pathname === link.path 
                ? '#495057' 
                : 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = location.pathname === link.path 
                ? '#495057' 
                : 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger Menu Button */}
      <button
        style={getResponsiveStyles().hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...getResponsiveStyles().hamburgerLine,
              transform: isMenuOpen 
                ? i === 1 ? 'rotate(45deg) translate(5px, 5px)' 
                : i === 2 ? 'rotate(-45deg) translate(7px, -6px)' 
                : 'scale(0)'
                : 'none'
            }}
          />
        ))}
      </button>

      {/* User Section */}
      <div style={getResponsiveStyles().userSection}>
        <span style={getResponsiveStyles().welcomeText} title={user?.name}>
          👋 {user?.name || 'User'}
        </span>
        
        <button
          onClick={logout}
          style={getResponsiveStyles().logoutBtn}
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
      {isMenuOpen && (
        <div style={getResponsiveStyles().mobileMenu}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...getResponsiveStyles().link,
                display: 'flex',
                padding: '1rem',
                fontSize: '1.1rem',
                justifyContent: 'flex-start',
                borderLeft: location.pathname === link.path ? '3px solid #ffc107' : 'none'
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
