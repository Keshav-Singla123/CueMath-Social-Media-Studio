import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

export default function HistoryPanel({ history, onRestore, onClear }) {
  if (history.length === 0) return null;

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      padding: '16px',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Clock size={11} /> RECENT
        </div>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Trash2 size={10} /> Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {history.slice().reverse().map((item, i) => (
          <button
            key={i}
            onClick={() => onRestore(item)}
            style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--border-purple)',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              fontSize: '11px',
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--text-primary)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.idea}
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontFamily: 'DM Sans, sans-serif',
              marginTop: '2px'
            }}>
              {item.format} · {item.timestamp}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
