import React, { useState } from 'react';
import { Copy, Check, Hash, RefreshCw } from 'lucide-react';

export default function CaptionPanel({ result, idea, onGenerate }) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState(null);

  const generateCaption = async () => {
    setGenerating(true);
    try {
      const cap = await onGenerate(idea, result);
      setCaption(cap);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!caption) return;
    navigator.clipboard.writeText(caption.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid var(--border-purple)',
      borderRadius: '16px',
      padding: '20px',
      width: '100%',
      maxWidth: '560px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: '13px',
          color: '#1A1033',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Hash size={14} color="#6C3AED" />
          Instagram Caption
        </div>
        <button
          onClick={generateCaption}
          disabled={generating}
          style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--border-purple)',
            color: '#6C3AED',
            padding: '5px 12px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <RefreshCw size={11} style={{ animation: generating ? 'spin 0.8s linear infinite' : 'none' }} />
          {caption ? 'Regenerate' : 'Generate Caption'}
        </button>
      </div>

      {!caption && !generating && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: 'var(--text-muted)',
          fontSize: '13px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          Click "Generate Caption" to get a ready-to-post Instagram caption with hashtags
        </div>
      )}

      {generating && (
        <div style={{
          padding: '16px',
          background: 'var(--bg-soft)',
          borderRadius: '10px',
          animation: 'pulse 1.5s ease infinite'
        }}>
          <div style={{ height: '12px', background: '#DDD6FE', borderRadius: '6px', marginBottom: '8px', width: '90%' }} />
          <div style={{ height: '12px', background: '#DDD6FE', borderRadius: '6px', marginBottom: '8px', width: '75%' }} />
          <div style={{ height: '12px', background: '#DDD6FE', borderRadius: '6px', width: '60%' }} />
        </div>
      )}

      {caption && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'var(--bg-soft)',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            maxHeight: '160px',
            overflowY: 'auto'
          }}>
            {caption.full}
          </div>

          {caption.hashtags && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px'
            }}>
              {caption.hashtags.map((tag, i) => (
                <span key={i} style={{
                  background: '#EDE9FE',
                  color: '#6C3AED',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#F0FDF4' : '#6C3AED',
              border: copied ? '1px solid #BBF7D0' : 'none',
              color: copied ? '#16A34A' : 'white',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.3s'
            }}
          >
            {copied ? <><Check size={14} /> Copied to clipboard!</> : <><Copy size={14} /> Copy Caption</>}
          </button>
        </div>
      )}
    </div>
  );
}
