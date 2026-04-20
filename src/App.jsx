import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Download, Archive, ImageIcon, FileImage, Layers, Wand2, Palette, Zap } from 'lucide-react';
import { generateContent, regenerateSlide, generateCaption } from './utils/groq';
import { exportSlideAsPNG, exportAllSlidesAsZip } from './utils/export';
import CarouselPreview from './components/CarouselPreview';
import CaptionPanel from './components/CaptionPanel';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';

const EXAMPLE_IDEAS = [
  "Carousel for parents about why kids forget what they learn — explain the forgetting curve — end with how spaced repetition fixes it",
  "Instagram post: 5 signs your child has math anxiety and what you can do about it",
  "Story: The difference between a child who loves math and one who fears it — it's not talent",
  "Carousel: Why 'just practice more' doesn't work for struggling students — and what actually does",
  "Post: 3 questions to ask your child after school instead of 'how was your day?'"
];

const FORMATS = [
  { id: 'carousel', label: 'Carousel', icon: Layers, desc: '6 slides' },
  { id: 'post', label: 'Post', icon: ImageIcon, desc: '1:1 square' },
  { id: 'story', label: 'Story', icon: FileImage, desc: '9:16 vertical' }
];

const COLOR_THEMES = [
  { name: 'Cuemath Purple', primary: '#6C3AED', accent: '#F9A825' },
  { name: 'Ocean Deep', primary: '#0D9488', accent: '#FBBF24' },
  { name: 'Coral Bold', primary: '#E11D48', accent: '#FB923C' }
];

const outlineBtn = {
  padding: '10px', borderRadius: '9px',
  border: '1.5px solid var(--border-purple)',
  background: 'white', color: '#6C3AED',
  fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
};

function SectionLabel({ children, icon }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
      letterSpacing: '1px', marginBottom: '8px',
      fontFamily: 'DM Sans, sans-serif',
      display: 'flex', alignItems: 'center', gap: '4px'
    }}>
      {icon}{children}
    </div>
  );
}

function normalizeGeneratedResult(data, requestedFormat) {
  if (!data || typeof data !== 'object') return data;
  if (requestedFormat === 'carousel') return { ...data, format: 'carousel' };
  if (requestedFormat === 'story') return { ...data, format: 'story' };
  return { ...data, format: 'post' };
}

export default function App() {
  const [idea, setIdea] = useState('');
  const [format, setFormat] = useState('carousel');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [regeneratingSlideIdx, setRegeneratingSlideIdx] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [history, setHistory] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [idea, format]);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      showToast('Please enter your post idea first!', 'error');
      textareaRef.current?.focus();
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await generateContent(idea.trim(), format);
      const normalizedData = normalizeGeneratedResult(data, format);
      setResult(normalizedData);
      const entry = {
        idea: idea.trim().slice(0, 60) + (idea.length > 60 ? '…' : ''),
        format,
        data: normalizedData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(h => [...h.slice(-9), entry]);
      showToast('✨ Creative ready!');
    } catch (err) {
      console.error(err);
      showToast(`Generation failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlide = useCallback((slideIndex, field, value) => {
    setResult(prev => {
      if (!prev) return prev;
      if (prev.format === 'carousel') {
        const slides = [...prev.slides];
        slides[slideIndex] = { ...slides[slideIndex], [field]: value };
        return { ...prev, slides };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleRegenerateSlide = async (slideIndex) => {
    if (!result || result.format !== 'carousel') return;
    setRegeneratingSlideIdx(slideIndex);
    try {
      const slide = result.slides[slideIndex];
      const newSlide = await regenerateSlide(slide, idea, format);
      setResult(prev => {
        const slides = [...prev.slides];
        slides[slideIndex] = { ...slide, ...newSlide };
        return { ...prev, slides };
      });
      showToast('Slide regenerated!');
    } catch (err) {
      showToast('Failed to regenerate slide', 'error');
    } finally {
      setRegeneratingSlideIdx(null);
    }
  };

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      await exportSlideAsPNG(0, 'cuemath-social');
      showToast('Exported as PNG!');
    } catch (err) {
      showToast('Export failed — try again', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportZip = async () => {
    if (!result?.slides) return;
    setExporting(true);
    try {
      await exportAllSlidesAsZip(result.slides, idea);
      showToast(`${result.slides.length} slides saved as ZIP!`);
    } catch (err) {
      showToast('ZIP export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleRestoreHistory = (entry) => {
    setIdea(entry.idea);
    setFormat(entry.format);
    setResult(normalizeGeneratedResult(entry.data, entry.format));
    showToast('Previous creative restored!');
  };

  const slides = result?.format === 'carousel'
    ? result.slides
    : result ? [{ ...result, slide_number: null }] : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-soft)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '0 28px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 12px rgba(108,58,237,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #6C3AED, #9333EA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', boxShadow: '0 3px 10px rgba(108,58,237,0.35)'
          }}>✨</div>
          <div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '14px', color: '#6C3AED' }}>Social Studio</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px', letterSpacing: '1px' }}>BY CUEMATH</span>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr',
        maxWidth: '1440px', width: '100%', margin: '0 auto',
        minHeight: 'calc(100vh - 56px)'
      }}>

        {/* Left Panel */}
        <div style={{
          background: 'white', borderRight: '1px solid var(--border)',
          padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: '18px',
          overflowY: 'auto', height: 'calc(100vh - 56px)', position: 'sticky', top: '56px'
        }}>
          {/* Format */}
          <div>
            <SectionLabel>FORMAT</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '7px' }}>
              {FORMATS.map(({ id, label, icon: Icon, desc }) => (
                <button key={id} onClick={() => setFormat(id)} style={{
                  padding: '10px 6px', borderRadius: '11px',
                  border: format === id ? '2px solid #6C3AED' : '2px solid var(--border)',
                  background: format === id ? '#F5F0FF' : 'white',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.2s'
                }}>
                  <Icon size={16} color={format === id ? '#6C3AED' : '#9CA3AF'} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: format === id ? '#6C3AED' : '#374151', fontFamily: 'Poppins, sans-serif' }}>{label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Idea */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <SectionLabel>YOUR IDEA</SectionLabel>
              <span style={{ fontSize: '10px', color: charCount > 350 ? '#EF4444' : 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{charCount}/400</span>
            </div>
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={e => { setIdea(e.target.value); setCharCount(e.target.value.length); }}
              placeholder={EXAMPLE_IDEAS[0]}
              maxLength={400}
              rows={5}
              style={{
                width: '100%', padding: '12px 13px', borderRadius: '11px',
                border: '2px solid var(--border)', fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)',
                resize: 'none', outline: 'none', lineHeight: 1.65, transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#6C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(108,58,237,0.09)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
            <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['Forgetting Curve', 'Math Anxiety', 'Spaced Rep.', 'Growth Mindset'].map((label, i) => (
                <button key={i} onClick={() => { setIdea(EXAMPLE_IDEAS[i]); setCharCount(EXAMPLE_IDEAS[i].length); }} style={{
                  background: 'var(--bg-soft)', border: '1px solid var(--border-purple)',
                  color: '#6C3AED', padding: '3px 9px', borderRadius: '99px',
                  fontSize: '10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div>
            <SectionLabel icon={<Palette size={10} style={{ marginRight: '2px' }} />}>COLOR THEME</SectionLabel>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {COLOR_THEMES.map((theme, i) => (
                <button key={i} onClick={() => setSelectedTheme(i)} title={theme.name} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  transform: selectedTheme === i ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: selectedTheme === i ? `0 0 0 2px white, 0 0 0 4px ${theme.primary}` : '0 2px 6px rgba(0,0,0,0.15)'
                }} />
              ))}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{COLOR_THEMES[selectedTheme].name}</span>
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #6C3AED, #9333EA)',
              backgroundSize: '400% 400%',
              animation: loading ? 'gradientShift 1.5s ease infinite' : 'none',
              color: 'white', fontSize: '14px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(108,58,237,0.4)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Generating magic...
              </>
            ) : (
              <><Wand2 size={16} /> Generate Creative</>
            )}
          </button>

          {/* Export */}
          {result && (
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
              <SectionLabel icon={<Zap size={10} style={{ marginRight: '2px' }} />}>EXPORT</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: result.format === 'carousel' ? '1fr 1fr' : '1fr', gap: '7px' }}>
                <button onClick={handleExportPNG} disabled={exporting} style={outlineBtn}><Download size={13} /> PNG</button>
                {result.format === 'carousel' && (
                  <button onClick={handleExportZip} disabled={exporting} style={outlineBtn}><Archive size={13} /> ZIP All</button>
                )}
              </div>
            </div>
          )}

          {/* History */}
          <HistoryPanel history={history} onRestore={handleRestoreHistory} onClear={() => setHistory([])} />
        </div>

        {/* Right Panel */}
        <div style={{ padding: '36px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px', overflowY: 'auto' }}>

          {/* Empty state */}
          {!result && !loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '22px', textAlign: 'center', padding: '50px 0', width: '100%' }}>
              <div style={{
                width: '88px', height: '88px', borderRadius: '24px',
                background: 'linear-gradient(135deg, #6C3AED, #9333EA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '38px', animation: 'float 3s ease-in-out infinite',
                boxShadow: '0 20px 50px rgba(108,58,237,0.28)'
              }}>✨</div>
              <div>
                <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: 800, color: '#1A1033', marginBottom: '8px' }}>Your creative will appear here</h2>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', maxWidth: '360px', lineHeight: 1.65, margin: '0 auto' }}>
                  Type a rough idea on the left, pick a format, and hit <strong>Generate Creative</strong>.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '540px', width: '100%' }}>
                {EXAMPLE_IDEAS.slice(0, 4).map((ex, i) => (
                  <button key={i} onClick={() => { setIdea(ex); setCharCount(ex.length); setFormat(['carousel','post','story','carousel'][i]); }}
                    style={{ background: 'white', border: '1.5px solid var(--border-purple)', borderRadius: '12px', padding: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(108,58,237,0.06)' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#6C3AED'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-purple)'}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#6C3AED', letterSpacing: '0.8px', marginBottom: '5px', fontFamily: 'DM Sans, sans-serif' }}>
                      {['CAROUSEL','POST','STORY','CAROUSEL'][i]}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{ex.slice(0, 65)}…"
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#6C3AED', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, animation: 'pulse 1.5s ease infinite' }}>
                ✨ Crafting your content...
              </div>
              <div style={{
                width: '100%', aspectRatio: format === 'story' ? '9/16' : '1/1', maxHeight: '440px',
                background: 'linear-gradient(135deg, #6C3AED15, #9333EA15)',
                borderRadius: '14px', animation: 'pulse 1.5s ease infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px'
              }}>
                <div style={{ fontSize: '44px', animation: 'float 1.8s ease infinite' }}>🎨</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#6C3AED', fontSize: '13px', opacity: 0.7 }}>
                  {format === 'carousel' ? 'Building 6 slides...' : `Designing your ${format}...`}
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'white', border: '1px solid var(--border)', borderRadius: '99px',
                  padding: '5px 14px', boxShadow: 'var(--shadow-sm)',
                  fontSize: '11px', fontWeight: 700, color: '#6C3AED', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.5px'
                }}>
                  {result.format === 'carousel' ? `📱 CAROUSEL · ${result.slides?.length} SLIDES` : result.format === 'story' ? '📱 STORY 9:16' : '📸 POST 1:1'}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>✏️ Click text to edit</span>
              </div>
              <CarouselPreview
                slides={slides}
                format={result.format}
                onEditSlide={handleEditSlide}
                onRegenerateSlide={handleRegenerateSlide}
                regeneratingSlide={regeneratingSlideIdx}
              />
              <CaptionPanel result={result} idea={idea} onGenerate={generateCaption} />
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        button:not(:disabled):active { transform: scale(0.97) !important; }
      `}</style>
    </div>
  );
}
