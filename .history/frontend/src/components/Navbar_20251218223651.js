import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ links }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#343a40',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              color: location.pathname === link.path ? '#ffc107' : 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: location.pathname === link.path ? '#495057' : 'transparent'
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'white' }}>Welcome, {user?.name}</span>
        <button
          onClick={logout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;