import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import SlideCanvas from './SlideCanvas';

export default function CarouselPreview({ slides, format, onEditSlide, onRegenerateSlide, regeneratingSlide }) {
  const [current, setCurrent] = useState(0);
  const isCarousel = format === 'carousel';
  const total = slides.length;

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(total - 1, c + 1));

  const handleEdit = (field, value) => {
    onEditSlide(current, field, value);
  };

  const regenAspect =
    format === 'story' ? '9/16' : format === 'slide' ? '16/9' : '1/1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>

      {/* Updated Slide Wrapper Div */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        ...(format === 'story' ? {
          width: 'min(100%, 360px)',
          aspectRatio: '9 / 16',
        } : format === 'slide' ? {
          width: '100%',
          maxWidth: '720px',
          aspectRatio: '16 / 9',
        } : {
          width: '100%',
          maxWidth: '520px',
          aspectRatio: '1 / 1',
        })
      }}>
        {regeneratingSlide === current ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #6C3AED, #9333EA)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'white'
          }}>
            <div style={{
              width: '40px', height: '40px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', opacity: 0.8 }}>
              Regenerating slide...
            </p>
          </div>
        ) : (
          <SlideCanvas
            slide={slides[current]}
            format={format}
            isActive={true}
            onEdit={handleEdit}
            index={current}
          />
        )}

        {/* Nav Arrows */}
        {isCarousel && total > 1 && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              style={{
                position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: current === 0 ? '#E5E7EB' : '#6C3AED',
                border: 'none', cursor: current === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s', zIndex: 20
              }}
            >
              <ChevronLeft size={20} color={current === 0 ? '#9CA3AF' : 'white'} />
            </button>
            <button
              onClick={next}
              disabled={current === total - 1}
              style={{
                position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: current === total - 1 ? '#E5E7EB' : '#6C3AED',
                border: 'none', cursor: current === total - 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s', zIndex: 20
              }}
            >
              <ChevronRight size={20} color={current === total - 1 ? '#9CA3AF' : 'white'} />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {isCarousel && total > 1 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                borderRadius: '99px',
                background: i === current ? '#6C3AED' : '#DDD6FE',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip */}
      {isCarousel && total > 1 && (
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          padding: '4px', width: '100%', justifyContent: 'center'
        }}>
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                flexShrink: 0,
                width: '52px', height: '52px',
                borderRadius: '8px',
                border: i === current ? '2.5px solid #6C3AED' : '2px solid transparent',
                background: slide.bg_style === 'white_purple' ? '#F5F0FF' : '#6C3AED',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s',
                transform: i === current ? 'scale(1.1)' : 'scale(1)',
                boxShadow: i === current ? '0 4px 12px rgba(108,58,237,0.3)' : 'none'
              }}
            >
              {slide.emoji || '📌'}
            </button>
          ))}
        </div>
      )}

      {/* Regenerate Button */}
      {isCarousel && (
        <button
          onClick={() => onRegenerateSlide(current)}
          disabled={regeneratingSlide !== null}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', border: '1.5px solid #DDD6FE',
            color: '#6C3AED', padding: '8px 18px', borderRadius: '99px',
            fontSize: '13px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
            cursor: regeneratingSlide !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', opacity: regeneratingSlide !== null ? 0.6 : 1,
            boxShadow: '0 2px 8px rgba(108,58,237,0.1)'
          }}
        >
          <RefreshCw size={14} style={{ animation: regeneratingSlide === current ? 'spin 0.8s linear infinite' : 'none' }} />
          Regenerate this slide
        </button>
      )}
    </div>
  );
}
