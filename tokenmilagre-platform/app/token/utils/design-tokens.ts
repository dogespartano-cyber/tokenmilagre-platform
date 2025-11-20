/**
 * Design Tokens for $MILAGRE Token Page
 * Solana-inspired color palette and design system
 */

export const colors = {
  // Solana Brand Colors
  solana: {
    purple: '#9945FF',
    green: '#14F195',
    blue: '#00D4AA',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
    purple: 'linear-gradient(135deg, #9945FF 0%, #7B3FF2 100%)',
    green: 'linear-gradient(135deg, #14F195 0%, #0AB87A 100%)',
    blue: 'linear-gradient(135deg, #00D4AA 0%, #0088CC 100%)',
    orange: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Neutrals (Dark Mode)
  neutral: {
    bg: {
      primary: '#0F0F0F',
      secondary: '#1A1A1A',
      tertiary: '#252525',
      elevated: 'rgba(255, 255, 255, 0.02)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      tertiary: '#707070',
      inverse: '#000000',
    },
    border: {
      light: '#333333',
      medium: '#404040',
      strong: '#505050',
    },
  },

  // Glass Effect
  glass: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
};

export const typography = {
  fontFamily: {
    display: 'var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif',
    body: 'var(--font-geist-sans), Inter, sans-serif',
    mono: 'var(--font-geist-mono), monospace',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.2)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.3)',
  glow: {
    purple: '0 0 20px rgba(153, 69, 255, 0.5)',
    green: '0 0 20px rgba(20, 241, 149, 0.5)',
    blue: '0 0 20px rgba(0, 212, 170, 0.5)',
  },
};

export const animations = {
  // Framer Motion Variants
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  scaleOnHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },

  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(153, 69, 255, 0.5)',
        '0 0 40px rgba(153, 69, 255, 0.8)',
        '0 0 20px rgba(153, 69, 255, 0.5)',
      ],
    },
    transition: { duration: 2, repeat: Infinity },
  },

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },

  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Export combined theme
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
};

export default theme;
