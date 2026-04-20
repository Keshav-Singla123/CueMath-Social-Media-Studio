export const BG_STYLES = {
  gradient_purple: {
    background: 'linear-gradient(135deg, #6C3AED 0%, #9333EA 50%, #4C1D95 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255,255,255,0.85)',
    accentColor: '#F9A825',
    patternColor: 'rgba(255,255,255,0.06)'
  },
  gradient_warm: {
    background: 'linear-gradient(135deg, #F9A825 0%, #FF6B35 50%, #E91E63 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255,255,255,0.9)',
    accentColor: '#FFFFFF',
    patternColor: 'rgba(255,255,255,0.08)'
  },
  white_purple: {
    background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F0FF 100%)',
    textColor: '#1A1033',
    subtextColor: '#6B7280',
    accentColor: '#6C3AED',
    patternColor: 'rgba(108,58,237,0.04)'
  },
  dark_purple: {
    background: 'linear-gradient(135deg, #1A1033 0%, #2D1B69 50%, #4C1D95 100%)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255,255,255,0.8)',
    accentColor: '#F9A825',
    patternColor: 'rgba(255,255,255,0.04)'
  }
};

export const FORMAT_DIMENSIONS = {
  post: { width: 1080, height: 1080, label: 'Instagram Post', ratio: '1:1' },
  story: { width: 1080, height: 1920, label: 'Instagram Story', ratio: '9:16' },
  carousel: { width: 1080, height: 1080, label: 'Carousel', ratio: '1:1' }
};

export function getSlideStyle(bgStyle) {
  return BG_STYLES[bgStyle] || BG_STYLES.gradient_purple;
}
