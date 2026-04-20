import React from 'react';
import { getSlideStyle } from '../utils/slideUtils';

const CuemathLogo = ({ color = '#FFFFFF', accentColor = '#F9A825' }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 800,
    fontSize: '16px',
    color: color,
    letterSpacing: '-0.5px'
  }}>
    <div style={{
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      background: accentColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 900,
      color: '#1A1033',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>C</div>
    Cuemath
  </div>
);

const BackgroundDecor = ({ isLight }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
    <svg width="100%" height="100%" style={{ position: 'absolute' }}>
      <circle cx="10%" cy="10%" r="25%" fill="white" fillOpacity={isLight ? "0.08" : "0.04"} />
      <circle cx="95%" cy="40%" r="30%" fill="white" fillOpacity={isLight ? "0.06" : "0.03"} />
      <circle cx="20%" cy="90%" r="20%" fill="white" fillOpacity={isLight ? "0.08" : "0.04"} />
      <path d="M-50 100 L150 -50" stroke="white" strokeWidth="80" strokeOpacity="0.02" fill="none" />
      <path d="M0 150 L200 0" stroke="white" strokeWidth="40" strokeOpacity="0.02" fill="none" />
    </svg>
  </div>
);

export default function SlideCanvas({ slide, format, isActive, onEdit, index }) {
  const styleConfig = getSlideStyle(slide.bg_style || 'gradient_purple');
  const isStory = format === 'story';
  const isSlide = format === 'slide';
  const isLight = slide.bg_style === 'white_purple';

  // Updated containerStyle as requested
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: styleConfig.background,
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)',
    animation: isActive ? 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
  };

  return (
    <div style={containerStyle} id={`slide-${index}`}>
      <style>{`
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05) rotate(5deg); }
        }
        .floating-emoji {
          animation: floatEmoji 4s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
      <BackgroundDecor isLight={isLight} />

      {/* Top Navigation */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '8%',
        right: '8%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          color: isLight ? '#6C3AED' : '#FFFFFF',
          opacity: 0.4,
          letterSpacing: '2px'
        }}>
          {slide.slide_number ? String(slide.slide_number).padStart(2, '0') : '••'}
        </div>
        <CuemathLogo color={isLight ? '#6C3AED' : '#FFFFFF'} accentColor={styleConfig.accentColor} />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isSlide ? 'row' : 'column',
        alignItems: isSlide ? 'center' : 'flex-start',
        justifyContent: isStory ? 'space-evenly' : 'center',
        padding: isSlide ? '10% 8% 10% 10%' : isStory ? '16% 10% 12%' : '0 10%',
        zIndex: 5,
        position: 'relative',
        gap: isStory ? '38px' : isSlide ? '40px' : '25px',
      }}>
        {/* Emoji */}
        {slide.emoji && (
          <div className="floating-emoji" style={{
            fontSize: isStory ? '80px' : isSlide ? '90px' : '95px',
            filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))',
            width: 'fit-content',
            lineHeight: 1,
            flexShrink: 0,
          }}>
            {slide.emoji}
          </div>
        )}

        {/* Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? '18px' : '12px' }}>
          <EditableText
            value={slide.headline}
            onChange={(v) => onEdit && onEdit('headline', v)}
            style={{
              fontSize: isStory ? 'clamp(22px, 6vw, 38px)' : isSlide ? 'clamp(24px, 4vw, 48px)' : 'clamp(30px, 7.5vw, 48px)',
              fontWeight: 900,
              color: styleConfig.textColor,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              textShadow: isLight ? 'none' : '0 10px 30px rgba(0,0,0,0.2)'
            }}
            editable={!!onEdit}
          />
          {slide.subtext && (
            <EditableText
              value={slide.subtext}
              onChange={(v) => onEdit && onEdit('subtext', v)}
              style={{
                fontSize: isStory ? '14px' : isSlide ? '18px' : '19px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                color: styleConfig.subtextColor,
                lineHeight: 1.5,
                opacity: 0.95,
                maxWidth: '95%'
              }}
              editable={!!onEdit}
            />
          )}

          {/* CTA */}
          {!isStory && slide.cta && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: styleConfig.accentColor,
              color: '#1A1033',
              padding: isStory ? '10px 22px' : '14px 32px',
              borderRadius: '99px',
              fontSize: isStory ? '13px' : '15px',
              fontWeight: 800,
              boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
              width: 'fit-content',
              marginTop: '8px'
            }}>
              {slide.cta} →
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '4% 10%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        background: isLight ? 'rgba(108, 58, 237, 0.03)' : 'rgba(0,0,0,0.05)',
        borderTop: `1px solid ${isLight ? 'rgba(108, 58, 237, 0.1)' : 'rgba(255,255,255,0.1)'}`
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: isLight ? '#6C3AED' : '#FFFFFF',
          opacity: 0.7,
          letterSpacing: '1.5px'
        }}>
          CUEMATH.COM
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: isLight ? '#6C3AED' : '#FFFFFF',
          opacity: 0.6,
          fontStyle: 'italic'
        }}>
          Learning Science ✨
        </div>
      </div>

      {/* Accent Strip */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: `linear-gradient(90deg, ${styleConfig.accentColor}, transparent 80%)`
      }} />
    </div>
  );
}

function EditableText({ value, onChange, style, editable }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(value);
  React.useEffect(() => setVal(value), [value]);

  if (editing && editable) {
    return (
      <textarea
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { setEditing(false); onChange(val); }}
        style={{
          ...style,
          background: 'rgba(255,255,255,0.1)',
          border: '1.5px dashed rgba(255,255,255,0.5)',
          width: '100%',
          outline: 'none',
          padding: '5px',
          fontFamily: 'inherit'
        }}
      />
    );
  }
  return (
    <div onClick={() => editable && setEditing(true)} style={style}>
      {val}
    </div>
  );
}
