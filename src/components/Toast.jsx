import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: isError ? '#FEF2F2' : '#F0FDF4',
      border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
      borderRadius: '12px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      zIndex: 9999,
      animation: 'fadeInUp 0.3s ease',
      maxWidth: '340px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      {isError
        ? <AlertCircle size={18} color="#EF4444" />
        : <CheckCircle size={18} color="#22C55E" />
      }
      <span style={{
        fontSize: '14px',
        color: isError ? '#991B1B' : '#15803D',
        flex: 1,
        fontWeight: 500
      }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', borderRadius: '4px' }}
      >
        <X size={14} color={isError ? '#EF4444' : '#22C55E'} />
      </button>
    </div>
  );
}
