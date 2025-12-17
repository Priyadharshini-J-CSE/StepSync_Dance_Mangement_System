import React from 'react';

const Alert = ({ message, type = 'info', onClose }) => {
  const getAlertStyle = () => {
    const baseStyle = {
      padding: '12px 16px',
      marginBottom: '16px',
      borderRadius: '4px',
      border: '1px solid',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' };
      case 'error':
        return { ...baseStyle, backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' };
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fff3cd', borderColor: '#ffeaa7', color: '#856404' };
      default:
        return { ...baseStyle, backgroundColor: '#d1ecf1', borderColor: '#bee5eb', color: '#0c5460' };
    }
  };

  return (
    <div style={getAlertStyle()}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;